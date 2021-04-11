import Validator from 'validator';
import validText from './validText';

export default function validateGratitude(gratitude) {
  let { text, createdAt, updatedAt } = gratitude;
  const errors = {};

  text = validText(text) ? text : '';

  if (Validator.isEmpty(text)) {
    errors.text = 'Text field is required';
  }

  if (!Validator.isDate(createdAt)) {
    errors.createdAt = 'Invalid date format';
  }

  if (!Validator.isDate(updatedAt)) {
    errors.updatedAt = 'Invalid date format';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
