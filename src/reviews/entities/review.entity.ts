import { ApiProperty } from '@nestjs/swagger';
import { reviews } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';
export class ReviewEntity implements reviews {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  work_id: string;

  @ApiProperty()
  rating: number;

  @ApiProperty({ required: false, nullable: true })
  review_text: string | null;

  @ApiProperty({ required: false, nullable: true })
  created_at: Date | null;

  @ApiProperty({ required: false, nullable: true })
  updated_at: Date | null;

  @ApiProperty({ required: false, type: UserEntity })
  users?: UserEntity;

  constructor({ users, ...data }: Partial<ReviewEntity>) {
    Object.assign(this, data);

    if (users) {
      this.users = new UserEntity(users);
    }
  }
}
