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
  UseGuards,
  UnauthorizedException,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiCookieAuth,
  ApiBody
} from '@nestjs/swagger';
import { WorkEntity } from './entities/work.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/users/users.controller';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { isArray } from 'class-validator';
import { AddWorkToShelvesDto } from './dto/add-work-to-shelves.dto';
import { PrismaService } from 'src/prisma.service';

@ApiTags('works')
@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService, private readonly prisma: PrismaService) { }
  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'language', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOkResponse()
  async findAll(
    @Query('title') title?: string,
    @Query('language') language?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    const filters = { title, language, limit, page };

    const works = await this.worksService.findAll(filters);
    return works;
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
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiCreatedResponse({ type: WorkEntity })
  async create(@Body() data: CreateWorkDto, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'You have to be an admin to perform this operation.',
      );
    }
    const work = await this.worksService.create(data);
    return new WorkEntity(work);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateWorkDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'You have to be an admin to perform this operation.',
      );
    }
    return new WorkEntity(await this.worksService.update(id, data));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: WorkEntity })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'You have to be an admin to perform this operation.',
      );
    }
    return new WorkEntity(await this.worksService.remove(id));
  }

  @Get(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: ReviewEntity, isArray: true })
  async getCommunityReviews(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ) {
    const reviews = await this.worksService.getCommmunityReviews(
      id,
      limit,
      offset,
      req.user.id,
    );

    if (isArray(reviews)) {
      return reviews.map((review) => new ReviewEntity(review));
    }
    return reviews;
  }

  @Post(':id/shelves')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: WorkEntity })
  async addToShelves(
    @Param('id') workId: string,
    @Body() data : AddWorkToShelvesDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const work = await this.prisma.works.findUnique({ where: { id: workId } });
    if (!work) {
      throw new NotFoundException('Work not found');
    }
    await this.worksService.addToShelves(workId, data.shelf_ids);
    return new WorkEntity(work);
  }
}
