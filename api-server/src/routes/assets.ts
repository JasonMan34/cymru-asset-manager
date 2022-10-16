import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate';
import Asset from '../models/asset';

const assetsRouter = Router();

assetsRouter.get('/', async (req, res) => {
  const assets = await Asset.find();
  res.json(assets);
});

assetsRouter.get('/:id', async (req, res) => {
  const assets = await Asset.findById(req.params.id);
  res.json(assets);
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
