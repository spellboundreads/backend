import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  openlibrary_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  first_publish_date?: Date;

  @IsOptional()
  @IsArray()
  @ApiProperty({ required: false })
  covers?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false })
  excerpts?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false })
  subjects?: string[];
}
