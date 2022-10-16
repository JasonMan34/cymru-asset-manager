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

    await scan.save();

    res.json(scan);
  }
);

export { scansRouter };
