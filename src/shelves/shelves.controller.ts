import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ShelvesService } from './shelves.service';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ShelfEntity } from './entities/shelf.entity';

@Controller('shelves')
@ApiTags('shelves')
export class ShelvesController {
  constructor(private readonly shelvesService: ShelvesService) {}

  @Post()
  @ApiCreatedResponse({ type: ShelfEntity })
  async create(@Body() createShelfDto: CreateShelfDto) {
    return new ShelfEntity(await this.shelvesService.create(createShelfDto));
  }

  @Get()
  @ApiOkResponse({ type: ShelfEntity, isArray: true })
  async findAll() {
    const shelves = await this.shelvesService.findAll();
    return shelves.map((shelf) => new ShelfEntity(shelf));
  }

  @Get(':id')
  @ApiOkResponse({ type: ShelfEntity })
  async findOne(@Param('id') id: string) {
    const shelf = await this.shelvesService.findOne(id);
    if (!shelf) {
      throw new NotFoundException(`Shelf not found`);
    }
    return new ShelfEntity(shelf);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ShelfEntity })
  async update(
    @Param('id') id: string,
    @Body() updateShelfDto: UpdateShelfDto,
  ) {
    return new ShelfEntity(
      await this.shelvesService.update(id, updateShelfDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ShelfEntity })
  async remove(@Param('id') id: string) {
    return new ShelfEntity(await this.shelvesService.remove(id));
  }
}
