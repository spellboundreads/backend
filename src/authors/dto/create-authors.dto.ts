import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateAuthorsDto {
  @IsNotEmpty()
  @IsString()
  openlibrary_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsDateString()
  death_date?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  portrait_url?: string;

  @IsOptional()
  @IsString({ each: true })
  photos?: string[];
}
