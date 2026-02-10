import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailRepository } from './email.repository';

@Module({
  controllers: [EmailController],
  providers: [EmailService, EmailRepository],
  exports: [EmailService],
})
export class EmailModule {}
