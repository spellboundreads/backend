import { shelves } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

export class ShelfEntity implements shelves {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty({ required: false, nullable: true })
  is_public: boolean | null;

  @ApiProperty()
  user_id: string;

  @Exclude()
  created_at: Date | null;

  @Exclude()
  updated_at: Date | null;

  @ApiProperty({ required: false, type: UserEntity })
  users?: UserEntity;

  constructor({ users, ...data }: Partial<ShelfEntity>) {
    Object.assign(this, data);

    if (users) {
      this.users = new UserEntity(users);
    }
  }
}
