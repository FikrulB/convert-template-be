import { TemplateController } from '#/modules/template/template.controller';
import { TemplateRepository } from '#/modules/template/template.repository';
import { TemplateService } from '#/modules/template/template.service';
import { UserRepository } from '#/modules/user/user.repository';
import { Module } from '@nestjs/common';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, TemplateRepository, UserRepository],
})
export class TemplatesModule {}
