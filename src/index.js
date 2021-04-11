import express from 'express';
import mongoose from 'mongoose';
import gratitudesRouter from './routes/gratitudes';
import { PORT, MONGODB_URI } from './config';

const app = express();

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });

app.use('/api/gratitudes', gratitudesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
