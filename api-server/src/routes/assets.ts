import { Router } from 'express';
import { body } from 'express-validator';
import { Types } from 'mongoose';
import { validate } from '../middlewares/validate';
import Asset from '../models/asset';

const assetsRouter = Router();

assetsRouter.get('/', async (req, res) => {
  const assets = await Asset.find();
  res.json(assets);
});

assetsRouter.get('/:id', async (req, res) => {
  const asset = await Asset.aggregate([
    // Find asset by id
    { $match: { _id: new Types.ObjectId(req.params.id) } },
    // Lookup scans for the asset
    {
      $lookup: {
        from: 'scans',
        localField: '_id',
        foreignField: 'assetId',
        as: 'scans',
      },
    },
  ]).exec();

  res.json(asset);
});

assetsRouter.post(
  '/',
  validate(body('name').isString().isLength({ min: 1 }), body('description').optional().isString()),
  async (req, res) => {
    const { name, description } = req.body;
    const asset = new Asset({
      name,
      description,
      ip: req.ip,
    });

    await asset.save();

    res.json(asset);
  }
);

export { assetsRouter };
