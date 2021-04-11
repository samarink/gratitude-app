export default function validText(str) {
  return typeof str === 'string' && str.trim().length > 0;
}
