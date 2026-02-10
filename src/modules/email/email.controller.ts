import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '#/common/guards/jwt.guard';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/')
  @HttpCode(200)
  async testSendMail() {
    return await this.emailService.sendMail('mfikrulb@gmail.com');
  }
}
