import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds: number;

  constructor(private config: ConfigService) {
    this.saltRounds = Number(this.config.get('SALT_ROUND'));
  }

  hash(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }

  compare(password: string, encrypted: string) {
    return bcrypt.compare(password, encrypted);
  }
}
