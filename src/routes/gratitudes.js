import express from 'express';
import Gratitude from '../models/gratitude';
const { check } = require('express-validator');

const router = express.Router();

router.get('/', async (_, res) => {
  const gratitudes = await Gratitude.find({});

  res.json(gratitudes);
});

router.get('/:id', async (req, res) => {
  const gratitude = await Gratitude.findById(req.params.id);
  res.json(gratitude);
});

router.post(
  '/',
  [check('text').notEmpty().isLength({ max: 1000 }).trim().escape()],
  async (req, res) => {
    const gratitudeObject = {
      text: req.body.text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const gratitude = new Gratitude(gratitudeObject);

    const savedGratitude = await gratitude.save();

    res.status(201).json(savedGratitude);
  }
);

router.put(
  '/:id',
  [
    check('text').notEmpty().isLength({ max: 1000 }).trim().escape(),
    check('createdAt').isDate(),
  ],
  async (req, res) => {
    const gratitudeObject = {
      text: req.body.text,
      createdAt: req.body.createdAt,
      updatedAt: new Date(),
    };

    const updatedGratitude = await Gratitude.findByIdAndUpdate(
      req.params.id,
      gratitudeObject,
      { new: true }
    );

    res.status(201).json(updatedGratitude);
  }
);

router.delete('/:id', async (req, res) => {
  const gratitude = await Gratitude.findByIdAndRemove(req.params.id);
  res.status(204).json(gratitude);
});

export default router;
