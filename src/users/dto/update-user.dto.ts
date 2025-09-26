import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  display_name: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  date_of_birth: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  avatar_url: string;
}
