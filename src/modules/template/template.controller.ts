import { TemplateDTO } from '#/modules/template/template.dto';
import { TemplateService } from '#/modules/template/template.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @HttpCode(200)
  async create(@Req() req: Request, @Body() body: TemplateDTO) {
    return await this.templateService.create(req.auth, body);
  }

  @Get(':code')
  @HttpCode(200)
  async read() {}

  @Patch(':code')
  @HttpCode(200)
  async update() {}

  @Delete(':code')
  @HttpCode(200)
  async kill() {}
}
