import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorsDto } from './create-authors.dto';

export class UpdateAuthorsDto extends PartialType(CreateAuthorsDto) {}
