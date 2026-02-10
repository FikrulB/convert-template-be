import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}

  async sendMail(email: string, data?: Record<string, string | number>) {
    if (!data) {
      data = {
        subject: 'Welcome 🎉',
        appName: 'Convert Template',
        name: 'Lynne',
        loginUrl: 'https://app.example.com/login',
        year: new Date().getFullYear(),
      };
    }

    await this.mailer.sendMail({
      to: email,
      subject: 'Welcome 🎉',
      template: 'welcome',
      context: data,
    });

    return;
  }
}
