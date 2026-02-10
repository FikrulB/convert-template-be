import { Injectable } from '@nestjs/common';
import { EmailRepository } from './email.repository';

@Injectable()
export class EmailService {
  constructor(private readonly emailRepo: EmailRepository) {}
}
