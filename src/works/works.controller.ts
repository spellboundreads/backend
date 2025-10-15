import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { WorkEntity } from './entities/work.entity';

@ApiTags('works')
@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}
  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'language', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOkResponse({ type: WorkEntity, isArray: true })
  async findAll(
    @Query('title') title?: string,
    @Query('language') language?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    const filters = { title, language, limit, page };

    return this.worksService.findAll(filters);
  }

  @Get(':olid')
  @ApiOkResponse({ type: WorkEntity })
  async findOne(@Param('olid') olid: string) {
    const work = await this.worksService.findOne(olid);
    if (!work) {
      throw new NotFoundException(`Work with OLID ${olid} not found`);
    }
    return new WorkEntity(work);
  }

  @Post()
  @ApiCreatedResponse({ type: WorkEntity })
  async create(@Body() data: CreateWorkDto) {
    const work = await this.worksService.create(data);
    return new WorkEntity(work);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateWorkDto) {
    return new WorkEntity(await this.worksService.update(id, data));
  }

  @Delete(':id')
  @ApiOkResponse({ type: WorkEntity })
  async remove(@Param('id') id: string) {
    return new WorkEntity(await this.worksService.remove(id));
  }
}
