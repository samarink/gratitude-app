import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 40,
    required: true,
    unique: true,
  },
  passwordHash: String,
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);
export default User;
