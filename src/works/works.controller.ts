import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorksService } from './works.service';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Get()
  findAll(@Req() req) {
    const filters: {
      title?: string;
      language?: string;
      limit?: number;
      page?: number;
    } = req.query;

    return this.worksService.findAll(filters);
  }

  @Get(':olid')
  findOne(@Param('olid') olid: string) {
    return this.worksService.findOne(olid);
  }

  @Post()
  create(@Body() createWorkDto) {
    return this.worksService.create(createWorkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.worksService.remove(+id);
  }
}
