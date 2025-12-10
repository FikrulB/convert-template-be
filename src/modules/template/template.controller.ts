import { TemplateService } from '#/modules/template/template.service';
import { Controller } from '@nestjs/common';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
}
