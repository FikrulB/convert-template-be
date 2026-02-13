import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  validate,
} from 'class-validator';

export function Record<T extends object>(
  type: new () => T,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateRecord',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: unknown, _: ValidationArguments) {
          if (typeof value !== 'object' || value === null) return false;

          const record = value as Record<string, unknown>;

          for (const key of Object.keys(record)) {
            const instance = plainToInstance(type, record[key]);
            const errors = await validate(instance);
            if (errors.length > 0) return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} tidak valid`;
        },
      },
    });
  };
}
