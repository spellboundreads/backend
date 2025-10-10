import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsDateString,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({ required: false })
  display_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @ApiProperty({ required: false })
  bio?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  avatar_url?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  date_of_birth?: string;
}
