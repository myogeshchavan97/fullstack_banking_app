export const maskNumber = (number) => {
  return number.slice(-4).padStart(number.length, '*');
};
