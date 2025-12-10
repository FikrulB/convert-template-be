import { Transform } from 'class-transformer';

export const ToNumber = () =>
  Transform(({ value }) =>
    value === '' || value === 0 || isNaN(Number(value))
      ? undefined
      : Number(value),
  );
