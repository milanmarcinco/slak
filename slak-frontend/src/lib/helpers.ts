export const clampNumber = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);
