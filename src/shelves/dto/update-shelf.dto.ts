import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateShelfDto } from './create-shelf.dto';

export class UpdateShelfDto extends PartialType(
  OmitType(CreateShelfDto, ['user_id'] as const),
) {}
