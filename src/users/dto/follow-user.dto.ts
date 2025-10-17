import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FollowUserDto {
  @ApiProperty({ description: 'The ID of the user to follow' })
  @IsUUID()
  following_id: string;
}
