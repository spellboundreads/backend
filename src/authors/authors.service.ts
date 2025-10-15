import { Injectable } from '@nestjs/common';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { PrismaService } from 'src/prisma.service';
import { authors as Author } from '@prisma/client';
import { OpenbookService } from 'src/openbook/openbook.service';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openbook: OpenbookService,
  ) {}

  async create(createAuthorsDto: CreateAuthorsDto) {
    return await this.prisma.authors.create({ data: createAuthorsDto });
  }

  async findAll() {
    return await this.prisma.authors.findMany();
  }

  async findOne(olid: string) {
    const existingAuthor = await this.prisma.authors.findUnique({
      where: { openlibrary_id: olid },
    });
    if (existingAuthor) {
      return existingAuthor;
    }

    const author = await this.openbook.getAuthor(olid);
    if (author) {
      await this.prisma.authors.create({
        data: {
          name: author.name || 'Unknown Author',
          openlibrary_id: olid,
          birth_date: author.birth_date || null,
          death_date: author.death_date || null,
          bio: typeof author.bio === 'string' ? author.bio : author.bio?.value,
          photos: author.photos?.map((photo) => photo.toString()) || [],
        },
      });
    }

    return this.prisma.authors.findUnique({
      where: { openlibrary_id: olid },
    });
  }

  async findWorks(olid: string) {
    return await this.openbook.getWorksOfAuthor(olid);
  }

  async update(id: string, updateAuthorsDto: UpdateAuthorsDto) {
    return await this.prisma.authors.update({
      where: { id },
      data: updateAuthorsDto,
    });
  }

  async remove(id: string): Promise<Author> {
    return await this.prisma.authors.delete({
      where: { id },
    });
  }
}
