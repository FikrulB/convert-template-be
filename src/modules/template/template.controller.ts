import { JwtAuthGuard } from '#/common/guards/jwt.guard';
import { CodeParamDTO, TemplateDTO } from '#/modules/template/template.dto';
import { TemplateService } from '#/modules/template/template.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @HttpCode(200)
  create(@Req() req: Request, @Body() body: TemplateDTO) {
    return this.templateService.create(req.auth, body);
  }

  @Get()
  @HttpCode(200)
  async readAll(@Req() req: Request) {
    return await this.templateService.readAll(req.auth);
  }

  @Get(':code')
  @HttpCode(200)
  async read(@Req() req: Request, @Param() param: CodeParamDTO) {
    return await this.templateService.read(req.auth, param);
  }

  @Patch(':code')
  @HttpCode(200)
  update(
    @Req() req: Request,
    @Body() body: TemplateDTO,
    @Param() param: CodeParamDTO,
  ) {
    return this.templateService.update(req.auth, body, param);
  }

  @Delete(':code')
  @HttpCode(200)
  delete(@Req() req: Request, @Param() param: CodeParamDTO) {
    return this.templateService.delete(req.auth, param);
  }
}
