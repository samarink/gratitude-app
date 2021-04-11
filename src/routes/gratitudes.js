import express from 'express';
import Gratitude from '../models/gratitude';
import validateGratitude from '../validation/gratitude';
import { toGratitudeObject } from '../utils/parseHelpers';

const router = express.Router();

router.get('/', async (_, res) => {
  const gratitudes = await Gratitude.find({});

  res.json(gratitudes);
});

router.get('/:id', async (req, res) => {
  const gratitude = await Gratitude.findById(req.params.id);
  res.json(gratitude);
});

router.post('/', async (req, res) => {
  const gratitudeObject = toGratitudeObject(req.body);

  const { errors, isValid } = validateGratitude(gratitudeObject);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const gratitude = new Gratitude(gratitudeObject);

  const savedGratitude = await gratitude.save();

  res.status(201).json(savedGratitude);
});

router.put('/:id', async (req, res) => {
  const gratitudeObject = toGratitudeObject(req.body);

  const { errors, isValid } = validateGratitude(gratitudeObject);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const updatedGratitude = await Gratitude.findByIdAndUpdate(
    req.params.id,
    gratitudeObject,
    { new: true }
  );

  res.json(updatedGratitude);
});

router.delete('/:id', async (req, res) => {
  const gratitude = await Gratitude.findByIdAndRemove(req.params.id);
  res.status(204).json(gratitude);
});

export default router;
