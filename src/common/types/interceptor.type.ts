export type SerializeBigInt<T> = T extends bigint
  ? number
  : T extends Date
    ? T
    : T extends Array<infer U>
      ? SerializeBigInt<U>[]
      : T extends object
        ? { [K in keyof T]: SerializeBigInt<T[K]> }
        : T;
