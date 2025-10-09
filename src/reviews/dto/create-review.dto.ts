import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  work_id: string;
  @IsNotEmpty()
  @IsString()
  review_text: string;
  @IsNotEmpty()
  @IsNumber()
  rating: number;
}
