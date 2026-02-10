import { TUserPayload } from '#/common/types/user-payload.type';
import { makeRandomString } from '#/common/utils/common.util';
import dayJs from '#/common/utils/dayjs.util';
import { HashService } from '#/common/utils/encrypt.util';
import { IUser } from '#/modules/auth/auth.interface';
import { AuthRepository } from '#/modules/auth/auth.repository';
import { LoginDTO, RegisterDTO } from '#/modules/auth/dto';
import { UserRepository } from '#/modules/user/user.repository';
import {
  ConflictException,
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

  async login(payload: LoginDTO) {
    const { email, password } = payload;

    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('User tidak terdaftar');

    this.validateUserStatus(user);

    const passwords = user.user_password;
    const hashedPassword = passwords?.[0]?.password;

    if (!hashedPassword)
      throw new NotFoundException(409, 'Email sudah digunakan');

    await this.validatePassword(password, hashedPassword);

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

  async register(payload: RegisterDTO) {
    const { email, password, fullname } = payload;

    const emailExist = await this.userRepo.findByEmail(email);
    if (emailExist)
      throw new ConflictException(
        'Email ini tidak dapat digunakan untuk pendaftaran. Jika Anda sudah pernah membuat akun sebelumnya, silakan coba login.',
      );

    const hashPassword = await this.hash.hash(password);
    const uniqueCode = makeRandomString({
      length: 30,
      isNumeric: true,
      isUpperCase: true,
      isLowerCase: false,
      isSpecialChar: false,
    });

    const newUser = await this.userRepo.createUser({
      unique_code: uniqueCode,
      email,
      start_at: dayJs().utc().toDate(),
      is_active: true,
      user_detail: {
        create: { fullname },
      },
      user_password: {
        create: { password: hashPassword },
      },
      user_role: {
        create: { role: { connect: { code: 'USR' } } },
      },
    });

    const saveTokens = this.refreshTokens(newUser.unique_code);

    return saveTokens;
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

  private generateAccessToken(payload: TUserPayload) {
    return this.jwtService.sign(payload, {
      secret: this.getAccessSecret(),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
    });
  }

  private generateRefreshToken(payload: TUserPayload) {
    return this.jwtService.sign(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  private validateUserStatus(user: IUser) {
    if (!user)
      throw new ForbiddenException('Informasi pengguna tidak ditemukan.');

    if (!user.is_active)
      throw new ForbiddenException(
        'Akun Anda sudah tidak aktif. Silakan hubungi administrator.',
      );

    if (dayJs().isBefore(user.start_at))
      throw new ForbiddenException(
        'Akun Anda belum dapat digunakan. Silakan hubungi administrator.',
      );

    if (user.end_at && dayJs().isAfter(user.end_at))
      throw new ForbiddenException(
        'Akun Anda tidak dapat digunakan. Silakan hubungi administrator.',
      );
  }

  private async validatePassword(password: string, encrypted: string) {
    const match = await this.hash.compare(password, encrypted);
    if (!match) throw new UnauthorizedException('Email atau Kata sandi salah');
  }
}
