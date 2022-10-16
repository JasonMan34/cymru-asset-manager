import { Router } from 'express';
import { body } from 'express-validator';
import Asset from '../models/asset';

const router = Router();

router.get('/', async (req, res) => {
  const assets = await Asset.find();
  res.json(assets);
});

router.get('/:id', async (req, res) => {
  const assets = await Asset.findById(req.params.id);
  res.json(assets);
});

router.post(
  '/',
  body('name').isString().isLength({ min: 1 }),
  body('description').optional().isString(),
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
