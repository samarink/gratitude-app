import jwt from 'jsonwebtoken';
import Gratitude from '../models/gratitude';
import User from '../models/user';
import { JWT_SECRET } from '../config';

const gratitudes = [
  {
    text: 'Gratitude 1',
  },
  {
    text: 'Gratitude 2',
  },
  {
    text: 'Gratitude 3',
  },
  {
    text: 'Gratitude 4',
  },
  {
    text: 'Gratitude 5',
  },
  {
    text: 'Gratitude 6',
  },
];

const gratitudesInDB = async () => {
  const gratitudes = await Gratitude.find({});
  return gratitudes.map((b) => b.toJSON());
};

const getValidToken = async () => {
  const user = new User({
    username: 'testting',
    password: 'password123456789!#',
  });

  const savedUser = await user.save();

  const payload = {
    username: savedUser.username,
    id: savedUser.id,
  };

  const token = jwt.sign(payload, JWT_SECRET);

  return `Bearer ${token}`;
};

export default {
  gratitudes,
  gratitudesInDB,
  getValidToken,
};
