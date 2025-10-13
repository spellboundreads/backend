import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthorEntity } from './entities/author.entity';
@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiCreatedResponse({ type: AuthorEntity })
  async create(@Body() createAuthorDto: CreateAuthorsDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  @ApiOkResponse({ type: AuthorEntity, isArray: true })
  async findAll() {
    const authors = await this.authorsService.findAll();
    if (!authors) {
      return [];
    }
    return authors.map((author) => new AuthorEntity(author));
  }

  @Get(':id')
  @ApiOkResponse({ type: AuthorEntity })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const author = await this.authorsService.findOne(id);
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    return new AuthorEntity(author);
  }

  @Patch(':id')
  @ApiOkResponse({ type: AuthorEntity })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthorsDto: UpdateAuthorsDto,
  ) {
    return new AuthorEntity(
      await this.authorsService.update(id, updateAuthorsDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: AuthorEntity })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.authorsService.remove(id);
  }
}
