import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  openlibrary_id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  birth_date?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  death_date?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  bio?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  portrait_url?: string;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ required: false })
  photos?: string[];
}
