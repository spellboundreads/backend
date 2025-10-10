import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateShelfDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description: string | null;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_public: boolean | null;

  @ApiProperty()
  @IsString()
  user_id: string;
}
