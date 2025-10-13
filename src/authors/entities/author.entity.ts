import { ApiProperty } from '@nestjs/swagger';

export class AuthorEntity {
  @ApiProperty() id: string;
  @ApiProperty() openlibrary_id: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true }) birth_date?: Date | null;
  @ApiProperty({ nullable: true }) bio?: string | null;
  @ApiProperty({ nullable: true }) portrait_url?: string | null;
  @ApiProperty({ nullable: true }) death_date?: Date | null;
  @ApiProperty({ nullable: true }) photos?: string[] | null;

  constructor(data: Partial<AuthorEntity>) {
    Object.assign(this, data);
  }
}
