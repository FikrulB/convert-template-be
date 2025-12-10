import { AuthRepository } from '#/modules/auth/auth.repository';
import { LoginDTO } from '#/modules/auth/dto';
import { UserRepository } from '#/modules/user/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async login(body: LoginDTO) {
    const { email, password } = body;

    // check user
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('User tidak terdaftar');

    console.log('user => ', user);

    return 'test';
  }

  async register() {}
}
