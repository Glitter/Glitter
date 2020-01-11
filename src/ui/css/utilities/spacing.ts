import rem from 'remcalc';

const allowedSizes = [
  4,
  8,
  12,
  16,
  24,
  32,
  48,
  64,
  96,
  128,
  192,
  256,
  512,
  640,
  768,
];

const spacingSizes = allowedSizes.reduce(
  (sizes, size): any => ({
    ...sizes,
    [size]: rem(size),
  }),
  [],
);

export const getSpacing = (size: number): number => spacingSizes[size];
