import dayJs from '#/common/utils/dayjs.util';
import { compare } from '#/common/utils/encrypt.util';
import { AuthRepository } from '#/modules/auth/auth.repository';
import { LoginDTO } from '#/modules/auth/dto';
import { UserRepository } from '#/modules/user/user.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });
  }

  generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  async login(body: LoginDTO) {
    const { email, password } = body;

    // Check user
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('User tidak terdaftar');

    // Check user active
    const userDetail = user.user_detail_user_detail_user_idTouser;
    if (!userDetail.is_active)
      throw new ForbiddenException(
        'Akun Anda sudah tidak aktif. Silakan hubungi administrator',
      );

    if (dayJs().isBefore(userDetail.start_at))
      throw new ForbiddenException(
        'Akun Anda belum dapat digunakan. Silakan hubungi administrator.',
      );

    if (userDetail.end_at && dayJs().isAfter(userDetail.end_at))
      throw new ForbiddenException(
        'Akun Anda tidak dapat digunakan. Silakan hubungi administrator',
      );

    // Check password
    const passwords = user.user_password_user_password_user_idTouser;
    if (!passwords?.length || !passwords[0].password)
      throw new NotFoundException('Kata sandi belum diatur untuk pengguna');

    const encryptedPassword = passwords[0].password;
    const validPassword = await compare(password, encryptedPassword);
    if (!validPassword)
      throw new UnauthorizedException('Email atau Kata sandi salah');

    // Create access token & refresh token
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({ sub: user.unique_code }),
      this.generateRefreshToken({ sub: user.unique_code }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register() {}
}
