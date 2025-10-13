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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ReviewEntity } from './entities/review.entity';
@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiCreatedResponse({ type: ReviewEntity })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return new ReviewEntity(await this.reviewsService.create(createReviewDto));
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
  @ApiOkResponse({ type: ReviewEntity })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return new ReviewEntity(
      await this.reviewsService.update(id, updateReviewDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ReviewEntity })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.reviewsService.remove(id);
  }
}
