import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAuthorsDto } from './create-authors.dto';

export class UpdateAuthorsDto extends PartialType(
  OmitType(CreateAuthorsDto, ['openlibrary_id'] as const),
) {}
