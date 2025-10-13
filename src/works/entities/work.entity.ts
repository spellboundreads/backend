import { ApiProperty } from '@nestjs/swagger';
import { AuthorEntity } from 'src/authors/entities/author.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';

class WorkAuthorEntity {
  @ApiProperty()
  work_id: string;

  @ApiProperty()
  author_id: string;

  @ApiProperty({ type: () => AuthorEntity })
  authors: AuthorEntity;
}

export class WorkEntity {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() description: string | null;
  @ApiProperty() openlibrary_id: string;
  @ApiProperty() first_publish_date: Date | null;
  @ApiProperty() covers: string[] | null;
  @ApiProperty() excerpts: string[] | null;
  @ApiProperty() subjects: string[] | null;

  @ApiProperty({ type: () => [WorkAuthorEntity] })
  works_authors?: WorkAuthorEntity[];

  @ApiProperty({ type: () => [ReviewEntity] })
  reviews?: ReviewEntity[];

  constructor({ works_authors, reviews, ...data }: Partial<WorkEntity>) {
    Object.assign(this, data);

    if (works_authors) {
      this.works_authors = works_authors.map((workAuthor) =>
        Object.assign(new WorkAuthorEntity(), workAuthor),
      );
    }

    if (reviews) {
      this.reviews = reviews.map((review) =>
        Object.assign(new ReviewEntity(review), review),
      );
    }
  }
}
