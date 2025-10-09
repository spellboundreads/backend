import { PickType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PickType(CreateReviewDto, [
  'review_text',
  'rating',
]) {}
