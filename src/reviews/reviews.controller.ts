import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReviewEntity } from './entities/review.entity';
import { AuthenticatedRequest } from 'src/users/users.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ReviewEntity })
  async create(
    @Body() data: CreateReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || req.user.id !== data.user_id) {
      throw new UnauthorizedException();
    }
    return new ReviewEntity(await this.reviewsService.create(data));
  }

  @Get()
  @ApiOkResponse({ type: ReviewEntity, isArray: true })
  async findAll() {
    const reviews = await this.reviewsService.findAll();
    return reviews.map((review) => new ReviewEntity(review));
  }

  @Get(':id')
  @ApiOkResponse({ type: ReviewEntity })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const review = await this.reviewsService.findOne(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return new ReviewEntity(review);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReviewEntity })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || req.user.id !== id) {
      throw new UnauthorizedException();
    }

    return new ReviewEntity(
      await this.reviewsService.update(id, updateReviewDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReviewEntity })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || req.user.id !== id) {
      throw new UnauthorizedException();
    }
    return await this.reviewsService.remove(id);
  }
}
