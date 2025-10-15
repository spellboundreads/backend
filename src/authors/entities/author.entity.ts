import { ApiProperty } from '@nestjs/swagger';
import { WorkEntity } from 'src/works/entities/work.entity';

export class AuthorEntity {
  @ApiProperty() id: string;
  @ApiProperty() openlibrary_id: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true }) birth_date?: string | null;
  @ApiProperty({ nullable: true }) bio?: string | null;
  @ApiProperty({ nullable: true }) portrait_url?: string | null;
  @ApiProperty({ nullable: true }) death_date?: string | null;
  @ApiProperty({ nullable: true }) photos?: string[] | null;

  constructor(data: Partial<AuthorEntity>) {
    Object.assign(this, data);
  }
}

export class AuthorsWorksEntity {
  @ApiProperty()
  size: number;

  @ApiProperty({ type: [WorkEntity] })
  entries: WorkEntity[];

  constructor(data: Partial<AuthorsWorksEntity>) {
    Object.assign(this, data);
  }
}
