import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
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
  @IsString()
  @ApiProperty({ required: false })
  birth_date: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  death_date: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  bio: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  portrait_url: string | null;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ required: false })
  photos: string[] | [];
}
