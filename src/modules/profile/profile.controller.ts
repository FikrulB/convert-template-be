import { JwtAuthGuard } from '#/common/guards/jwt.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { UpdateProfileDTO } from '#/modules/profile/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/me')
  @HttpCode(200)
  read(@Req() req: Request) {
    return this.profileService.read(req.auth);
  }

  @Patch('/me')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg'];
        const allowedExt = ['.png', '.jpg', '.jpeg'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (
          !allowedMimeTypes.includes(file.mimetype) ||
          !allowedExt.includes(ext)
        )
          return cb(
            new BadRequestException(
              'Hanya file PNG atau JPEG yang diperbolehkan',
            ),
            false,
          );

        cb(null, true);
      },
      limits: { files: 1, fileSize: 5 * 1024 * 1024 },
    }),
  )
  @HttpCode(200)
  async update(
    @Req() req: Request,
    @Body() body: UpdateProfileDTO,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    await this.profileService.update(req.auth, body, avatar);
  }
}
