import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import logger from './utils/logger';
import middleware from './utils/middleware';
import gratitudesRouter from './routes/gratitudes';
import { MONGODB_URI } from './config';

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

app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/gratitudes', gratitudesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
