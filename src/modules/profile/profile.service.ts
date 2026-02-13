import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { TUserPayload } from '#/common/types/user-payload.type';
import { UpdateProfileDTO } from '#/modules/profile/profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly repo: ProfileRepository) {}

  async read(user: TUserPayload) {
    const profile = await this.repo.findByUnique(user.sub);
    if (!profile) throw new NotFoundException('Profil Anda tidak ditemukan');

    return {
      name: profile.user_detail.fullname,
      email: profile.email,
      address: profile.user_detail.address,
      avatar: profile.user_detail.avatar,
      phoneNumber: profile.user_detail.phone_number,
    };
  }

  async update(
    user: TUserPayload,
    payload: UpdateProfileDTO,
    avatar?: Express.Multer.File,
  ) {
    const { name, phoneNumber, email, address } = payload;

    if (avatar) {
      console.log('avatar ', avatar);
    }

    await this.repo.update(user.sub, {
      email,
      user_detail: {
        update: {
          fullname: name,
          phone_number: phoneNumber,
          address,
        },
      },
    });

    return null;
  }
}
