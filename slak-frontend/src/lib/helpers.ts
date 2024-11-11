export const clampNumber = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const includes = <T>(array: T[], predicate: (item: T) => boolean) =>
  array.findIndex(predicate) !== -1;
