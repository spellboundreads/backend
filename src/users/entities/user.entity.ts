import { $Enums, users } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity implements users {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  bio: string | null;

  @ApiProperty()
  avatar_url: string | null;

  @ApiProperty()
  username: string;

  @ApiProperty()
  display_name: string | null;

  @Exclude()
  email: string;

  @Exclude()
  date_of_birth: Date | null;

  @Exclude()
  role: $Enums.user_role;

  @Exclude()
  password: string;

  @Exclude()
  created_at: Date | null;

  @Exclude()
  deleted_at: Date | null;

  @Exclude()
  updated_at: Date | null;
}
