import { Queue, Worker } from 'bullmq';
import Scan from './models/scan';

import { logger } from './logger';

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
  if (Math.random() < 0.1) {
    // Simulate failure to rerun failed jobs
    throw new Error('Unexpected error!');
  }

  return 'Success';
};

export const initWorker = () => {
  const worker = new Worker('scans', processor, { connection });

  worker.on('completed', job => {
    logger.info(`Scan ${job.name} for asset ${job.data.assetId} has scanned successfully`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Scan ${job.name} for asset ${job.data.assetId} has failed with ${err.message}`);
  });
};

export const initDbListener = () => {
  const scansChangeStream = Scan.watch<any>();

  scansChangeStream.on('change', change => {
    if (change.operationType === 'insert') {
      const delay = change.fullDocument.scanDueDate.getTime() - new Date().getTime();

      queue.add(
        change.documentKey._id.toString(),
        { assetId: change.fullDocument.assetId },
        { delay }
      );
    }
  });
};
