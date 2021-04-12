import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { check } from 'express-validator';

const router = express.Router();

router.get('/', async (_, res) => {
  const users = await User.find({});
  res.json(users);
});

router.post(
  '/',
  [
    check('username').isLength({ min: 3, max: 40 }).isAlphanumeric(),
    check('password').isLength({ min: 8, max: 60 }),
  ],
  async (req, res) => {
    const { username, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      passwordHash,
    });

    const savedUser = await user.save();
    res.json(savedUser);
  }
);

router.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id);

  if (user) {
    return response.json(user);
  } else {
    return response.code(404).end();
  }
});

export default router;
