import express from 'express';
import jwt from 'jsonwebtoken';
import { check } from 'express-validator';
import { JWT_SECRET } from '../config';

import Gratitude from '../models/gratitude';
import User from '../models/user';

const router = express.Router();

router.get('/', async (_, res) => {
  const gratitudes = await Gratitude.find({}).populate('user', { username: 1 });
  res.json(gratitudes);
});

router.get('/:id', async (req, res) => {
  const gratitude = await Gratitude.findById(req.params.id).populate('user', {
    username: 1,
  });

  res.json(gratitude);
});

router.post(
  '/',
  [check('text').notEmpty().trim().escape()],
  async (req, res) => {
    const decodedToken = jwt.verify(req.token, JWT_SECRET);

    if (!req.token || !decodedToken.id) {
      return res
        .status(401)
        .json({ error: 'authorization token is missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    const gratitudeObject = {
      text: req.body.text,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: user._id,
    };

    const gratitude = new Gratitude(gratitudeObject);
    const savedGratitude = await gratitude.save();

    user.gratitudes = [...user.gratitudes, savedGratitude._id];
    await user.save();

    res.status(201).json(savedGratitude);
  }
);

router.put(
  '/:id',
  [check('text').notEmpty().isLength({ max: 1000 }).trim().escape()],
  async (req, res) => {
    const decodedToken = jwt.verify(req.token, JWT_SECRET);

    if (!req.token || !decodedToken.id) {
      return res
        .status(401)
        .json({ error: 'authorization token is missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);
    const gratitude = await Gratitude.findById(req.params.id);

    if (!user._id.equals(gratitude.user)) {
      return res
        .status(401)
        .json({ error: 'authorization token is missing or invalid' });
    }

    gratitude.text = req.body.text;
    gratitude.updatedAt = new Date();
    await gratitude.save();

    res.status(201).json(gratitude);
  }
);

router.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, JWT_SECRET);

  if (!req.token || !decodedToken.id) {
    return res
      .status(401)
      .json({ error: 'authorization token is missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);
  const gratitude = await Gratitude.findById(req.params.id);

  if (!user._id.equals(gratitude.user)) {
    return res
      .status(401)
      .json({ error: 'authorization token is missing or invalid' });
  }

  await gratitude.delete();
  res.status(204).end();
});

export default router;
