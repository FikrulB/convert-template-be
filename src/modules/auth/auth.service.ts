import { LoginDTO } from '#/modules/auth/dto/login.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async login(body: LoginDTO) {
    const { email, password } = body;
    await Promise.all([]);

    return 'test';
  }
}
