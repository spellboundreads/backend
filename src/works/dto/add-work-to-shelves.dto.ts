import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AddWorkToShelvesDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty()
  shelf_ids: string[];
}
