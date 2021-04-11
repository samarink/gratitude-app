import express from 'express';
import Gratitude from '../models/gratitude';

const router = express.Router();

router.get('/', async (_, res) => {
  const gratitudes = await Gratitude.find({});

  res.json(gratitudes);
});

export default router;
