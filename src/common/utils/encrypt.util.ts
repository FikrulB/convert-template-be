import * as bcrypt from 'bcrypt';

const saltRounds = process.env.SALT_ROUND;

export async function hash(password: string) {
  return await bcrypt.hash(password, saltRounds);
}

export async function compare(password: string, encryptedPassword: string) {
  return await bcrypt.compare(password, encryptedPassword);
}
