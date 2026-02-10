import { Match } from '#/common/decorators/match.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password wajib berupa text' })
  password: string;
}

export class RegisterDTO {
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password wajib berupa teks' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @MaxLength(100, { message: 'Password maksimal 100 karakter' })
  @Matches(/^(?=.*[a-z])/, {
    message: 'Password wajib mengandung huruf kecil',
  })
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Password wajib mengandung huruf besar',
  })
  @Matches(/^(?=.*\d)/, {
    message: 'Password wajib mengandung angka',
  })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password wajib mengandung simbol',
  })
  @Matches(/^[^\s]+$/, {
    message: 'Password tidak boleh mengandung spasi',
  })
  password: string;

  @IsNotEmpty({ message: 'Konfirmasi Password tidak boleh kosong' })
  @IsString({ message: 'Konfirmasi Password wajib berupa text' })
  @Match('password', {
    message: 'Konfirmasi password tidak sama dengan password',
  })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Nama Lengkap tidak boleh kosong' })
  @IsString({ message: 'Nama Lengkap wajib berupa text' })
  fullname: string;

  @IsOptional()
  @IsString({ message: 'Alamat wajib berupa text' })
  address?: string;
}
