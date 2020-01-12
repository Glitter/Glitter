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

const spacingSizes: { [key: string]: string } = allowedSizes.reduce(
  (sizes, size): { [key: string]: string } => ({
    ...sizes,
    [size.toString()]: rem(size),
  }),
  {},
);

export const getSpacing = (size: number): string => {
  if (spacingSizes[size.toString()] === undefined) {
    return '';
  }

  return spacingSizes[size.toString()];
};
