import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateAuthorsDto {
  @IsString()
  openlibrary_id: string;

  @IsString()
  full_name: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  portrait_url?: string;
}
