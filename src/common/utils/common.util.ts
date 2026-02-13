export function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array.join('');
}

export function makeRandomString({
  length = 8,
  isLowerCase = true,
  isUpperCase = false,
  isNumeric = false,
  isSpecialChar = false,
}: {
  length: number;
  isLowerCase?: boolean;
  isUpperCase?: boolean;
  isNumeric?: boolean;
  isSpecialChar?: boolean;
}) {
  const lowerCase = isLowerCase ? 'abcdefghijklmnopqrstuvwxyz' : '';
  const upperCase = isUpperCase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '';
  const numeric = isNumeric ? '0123456789' : '';
  const specialChar = isSpecialChar ? '!@#$%^&*()_+[]{}|;:,.<>?' : '';

  const characters = shuffleString(
    lowerCase + upperCase + numeric + specialChar,
  );
  const charactersLength = characters.length;

  let counter = 0;
  let result = '';

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}

export function createEnumMapper<const M extends Record<string, string>>(
  toPrismaMap: M,
) {
  type AppEnum = keyof M;
  type PrismaEnum = M[keyof M];

  const fromPrismaMap = Object.entries(toPrismaMap).reduce(
    (acc, [key, val]) => {
      acc[val as PrismaEnum] = key as AppEnum;
      return acc;
    },
    {} as Record<PrismaEnum, AppEnum>,
  );

  return {
    toPrisma(value: AppEnum): PrismaEnum {
      const prismaValue = toPrismaMap[value];
      if (!prismaValue) throw new Error(`Invalid enum value: ${String(value)}`);
      return prismaValue;
    },
    fromPrisma(value: PrismaEnum): AppEnum {
      const appValue = fromPrismaMap[value];
      if (!appValue) throw new Error(`Invalid Prisma enum: ${value}`);
      return appValue;
    },
    fromString(value: string): AppEnum {
      if (!(value in toPrismaMap)) {
        throw new Error(`Invalid enum value "${value}".`);
      }
      return value as AppEnum;
    },
  };
}
