import mongoose from 'mongoose';

const gratitudeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Gratitude = mongoose.model('Gratitude', gratitudeSchema);

export default Gratitude;
