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
  Req,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthorEntity, AuthorsWorksEntity } from './entities/author.entity';
import { WorkEntity } from 'src/works/entities/work.entity';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/users/users.controller';
@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiCreatedResponse({ type: AuthorEntity })
  async create(
    @Body() createAuthorDto: CreateAuthorsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'You have to be an admin to perform this operation.',
      );
    }
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

  @Get(':olid')
  @ApiOkResponse({ type: AuthorEntity })
  async findOne(@Param('olid') olid: string) {
    const author = await this.authorsService.findOne(olid);
    if (!author) {
      throw new NotFoundException(`Author with id ${olid} not found`);
    }
    return new AuthorEntity(author);
  }

  @Get(':olid/works')
  @ApiOkResponse({ type: AuthorsWorksEntity })
  async findWorks(@Param('olid') olid: string) {
    const works = await this.authorsService.findWorks(olid);
    if (!works) {
      throw new NotFoundException(`Works for author id ${olid} not found`);
    }
    return new AuthorsWorksEntity({
      size: works.size,
      entries: works.entries.map((work) => new WorkEntity(work)),
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: AuthorEntity })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthorsDto: UpdateAuthorsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'You have to be an admin to perform this operation.',
      );
    }

    return new AuthorEntity(
      await this.authorsService.update(id, updateAuthorsDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: AuthorEntity })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'You have to be an admin to perform this operation.',
      );
    }
    return await this.authorsService.remove(id);
  }
}
