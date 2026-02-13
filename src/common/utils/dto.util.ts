import { Transform } from 'class-transformer';

export const ToNumber = () =>
  Transform(({ value }) =>
    value === '' || value === 0 || isNaN(Number(value))
      ? undefined
      : Number(value),
  );

export const ToBoolean = () =>
  Transform(({ value }) => {
    if (typeof value === 'boolean') return Boolean(value);

    if (typeof value === 'string') {
      const normalized = value.toLowerCase().trim();

      if (normalized === 'true' || normalized === '1') return true;
      if (normalized === 'false' || normalized === '0') return false;
    }

    return '__INVALID_BOOLEAN__';
  });
