import { IsEmail, IsString, IsOptional } from 'class-validator';
import { user_role } from '@prisma/client';

export class AdminUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  role: user_role;

  @IsString()
  display_name: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;

  @IsString()
  @IsOptional()
  date_of_birth?: string;
}
