import { UserPayload } from '#/common/types/user-payload.type';
import dayJs from '#/common/utils/dayjs.util';
import { HashService } from '#/common/utils/encrypt.util';
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
    private readonly config: ConfigService,
    private readonly hash: HashService,
  ) {}

  async login(body: LoginDTO) {
    const { email, password } = body;

    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('User tidak terdaftar');

    this.validateUserStatus(user.user_detail_user_detail_user_idTouser);

    const passwords = user.user_password_user_password_user_idTouser;
    if (!passwords?.[0]?.password)
      throw new NotFoundException('Kata sandi belum diatur untuk pengguna');

    await this.validatePassword(password, passwords[0].password);

    const accessToken = this.generateAccessToken({
      sub: user.unique_code,
      email: user.email,
    });
    const refreshToken = this.generateRefreshToken({
      sub: user.unique_code,
      email: user.email,
    });

    const [atHashed, rtHashed] = await Promise.all([
      this.hash.hash(accessToken),
      this.hash.hash(refreshToken),
    ]);

    await this.authRepo.saveTokens(user.id, atHashed, rtHashed);

    return { accessToken, refreshToken };
  }

  async refreshTokens(code: string) {
    const user = await this.userRepo.findByUniqueCode(code);
    if (!user) throw new NotFoundException('User tidak terdaftar');

    const accessToken = this.generateAccessToken({
      sub: user.unique_code,
      email: user.email,
    });
    const refreshToken = this.generateRefreshToken({
      sub: user.unique_code,
      email: user.email,
    });

    const [atHashed, rtHashed] = await Promise.all([
      this.hash.hash(accessToken),
      this.hash.hash(refreshToken),
    ]);

    await this.authRepo.saveTokens(user.id, atHashed, rtHashed);

    return { accessToken, refreshToken };
  }

  private getAccessSecret() {
    return this.config.get<string>('JWT_ACCESS_SECRET');
  }

  private getRefreshSecret() {
    return this.config.get<string>('JWT_REFRESH_SECRET');
  }

  private generateAccessToken(payload: UserPayload) {
    return this.jwtService.sign(payload, {
      secret: this.getAccessSecret(),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
    });
  }

  private generateRefreshToken(payload: UserPayload) {
    return this.jwtService.sign(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  private validateUserStatus(detail: any) {
    if (!detail)
      throw new ForbiddenException('Informasi pengguna tidak ditemukan.');

    if (!detail.is_active)
      throw new ForbiddenException(
        'Akun Anda sudah tidak aktif. Silakan hubungi administrator.',
      );

    if (dayJs().isBefore(detail.start_at))
      throw new ForbiddenException(
        'Akun Anda belum dapat digunakan. Silakan hubungi administrator.',
      );

    if (detail.end_at && dayJs().isAfter(detail.end_at))
      throw new ForbiddenException(
        'Akun Anda tidak dapat digunakan. Silakan hubungi administrator.',
      );
  }

  private async validatePassword(password: string, encrypted: string) {
    const match = await this.hash.compare(password, encrypted);
    if (!match) throw new UnauthorizedException('Email atau Kata sandi salah');
  }
}
