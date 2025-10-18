import { ApiProperty } from '@nestjs/swagger';

export class LikeReviewDto {
  @ApiProperty()
  review_id: string;
}
