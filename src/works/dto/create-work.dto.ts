import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  openlibrary_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  first_publish_date?: Date;

  @IsOptional()
  @IsArray()
  covers?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  excerpts?: string[];

  @IsArray()
  @IsOptional()
  subjects?: string[];
}
