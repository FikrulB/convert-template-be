import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDTO {
  @IsOptional()
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Nama Lengkap wajib berupa text' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Alamat wajib berupa text' })
  address?: string;

  @IsOptional()
  @Matches(/^[0-9]{9,15}$/, {
    message: 'Nomor HP harus berupa angka 9-15 digit',
  })
  phone_number?: string;
}
