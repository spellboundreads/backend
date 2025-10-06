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
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';

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
  create(@Body() data: CreateWorkDto) {
    return this.worksService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateWorkDto) {
    return this.worksService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.worksService.remove(id);
  }
}
