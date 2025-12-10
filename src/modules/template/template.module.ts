import { TemplateController } from '#/modules/template/template.controller';
import { TemplateService } from '#/modules/template/template.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplatesModule {}
