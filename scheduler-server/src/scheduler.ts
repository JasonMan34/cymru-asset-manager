import { Queue, Worker } from 'bullmq';
import Scan, { ScanStatus } from './models/scan';
import { logger } from './logger';

// Number of attempts to scan before marking scan as failed
const MAX_SCAN_ATTEMPTS = 3;

const host = process.env.REDIS_HOST;
const username = process.env.REDIS_USER;
const password = process.env.REDIS_PASS;
const port = parseInt(process.env.REDIS_PORT || '6379');

const connection = { host, username, password, port };

let queue: Queue;
export const initQueue = () => {
  if (!queue) {
    queue = new Queue('scans', { connection });
  }
};

const processor = async (job: any) => {
  if (Math.random() < 0.5) {
    // Simulate failure to rerun failed jobs
    throw new Error('Unexpected error!');
  }

  return 'Success';
};

export const initWorker = () => {
  const worker = new Worker('scans', processor, { connection });

  worker.on('completed', async job => {
    await Scan.updateOne({ _id: job.name }, { status: ScanStatus.Success });
    logger.info(`Scan ${job.name} for asset ${job.data.assetId} has scanned successfully`);
  });

  worker.on('failed', async (job, err) => {
    if (job.attemptsMade === MAX_SCAN_ATTEMPTS) {
      await Scan.updateOne({ _id: job.name }, { status: ScanStatus.Failed });
    }
    logger.error(`Scan ${job.name} for asset ${job.data.assetId} has failed with ${err.message}`);
  });
};

const addScanToQueue = (id: string, doc: any) => {
  logger.info(`Adding scan ${id} to queue`);

  let delay = doc.scanDueDate.getTime() - new Date().getTime();
  if (delay < 0) {
    delay = 0;
  }

  return queue.add(
    id,
    { assetId: doc.assetId },
    {
      jobId: id,
      delay,
      attempts: MAX_SCAN_ATTEMPTS,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    }
  );
};

const removeScanFromQueue = async (id: string) => {
  logger.info(`Attempting to remove scan ${id} from queue`);
  const job = await queue.getJob(id);
  if (job) {
    await job.remove();
    logger.info(`Successfully removed scan ${id} from queue`);
    return true;
  }

  logger.info(`No job for scan ${id} exists in the  queue`);
  return false;
};

const updateScanInQueue = async (id: string) => {
  logger.info(`Updating job for scan ${id}`);
  const removed = await removeScanFromQueue(id);

  // If no job was removed, the job has already completed. So no need to add a new one
  if (removed) {
    const scan = await Scan.findById(id);
    return addScanToQueue(id, scan);
  }
};

export const initDbListener = () => {
  const scansChangeStream = Scan.watch<any>();

  scansChangeStream.on('change', change => {
    if (change.operationType === 'insert') {
      addScanToQueue(change.documentKey._id.toString(), change.fullDocument);
    } else if (change.operationType === 'delete') {
      removeScanFromQueue(change.documentKey._id.toString());
    } else if (
      change.operationType === 'update' &&
      change.updateDescription.updatedFields &&
      'scanDueDate' in change.updateDescription.updatedFields
    ) {
      updateScanInQueue(change.documentKey._id.toString());
    }
  });
};
