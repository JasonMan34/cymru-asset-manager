import { Router } from 'express';
import { body } from 'express-validator';
import Scan from '../models/scan';

const scansRouter = Router();

scansRouter.post(
  '/',
  body('assetId').isString().isLength({ min: 7 }),
  body('scanDueDate').isISO8601(),
  async (req, res) => {
    const { assetId, scanDueDate } = req.body;
    const scan = new Scan({
      assetId,
      scanDueDate,
    });

    // TODO: Handle invalid assetId.
    // Should be easy no matter which implementation we choose, even if we change it
    // so that scans only save inside asset documents.
    // Probably not what the task is about, so not implemeting for now
    await scan.save();

    res.json(scan);
  }
);

export { scansRouter };
