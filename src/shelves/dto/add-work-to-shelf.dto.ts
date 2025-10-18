import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddWorkToShelfDto {
  @ApiProperty()
  @IsUUID()
  work_id: string;
}
