import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
export class CreateReviewDto {
  @IsString()
  @ApiProperty()
  user_id: string;

  @IsString()
  @ApiProperty()
  work_id: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  @ApiProperty({ required: false })
  review_text: string;

  @IsNumber()
  @Max(10)
  @Min(0)
  @ApiProperty()
  rating: number;
}
