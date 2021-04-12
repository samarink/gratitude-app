import mongoose from 'mongoose';

const gratitudeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: Date,
  updatedAt: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

gratitudeSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Gratitude = mongoose.model('Gratitude', gratitudeSchema);

export default Gratitude;
