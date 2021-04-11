import xss from 'xss';

export const toGratitudeObject = ({ text, createdAt }) => ({
  text: xss(text),
  createdAt: xss(createdAt) || new Date(),
  updatedAt: new Date(),
});
