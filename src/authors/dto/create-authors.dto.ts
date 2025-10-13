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
  @ApiProperty()
  birth_date?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  death_date?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bio?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  portrait_url?: string;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty()
  photos?: string[];
}
