import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cors from 'cors';

import logger from './utils/logger';
import middleware from './utils/middleware';
import { MONGODB_URI } from './config';

import gratitudesRouter from './routes/gratitudes';
import usersRouter from './routes/users';
import loginRouter from './routes/login';

const app = express();

logger.info('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/gratitudes', gratitudesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
