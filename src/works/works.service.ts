import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { OpenbookService } from 'src/openbook/openbook.service';
import { AuthorsService } from 'src/authors/authors.service';
import { WorkSchema } from 'openbook.js';
@Injectable()
export class WorksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openbook: OpenbookService,
    private readonly authorService: AuthorsService,
  ) {}

  async findAll(filters: {
    title?: string;
    language?: string;
    limit?: number;
    page?: number;
  }) {
    const { title, language, limit, page } = filters;
    if (!title) {
      return [];
    }

    type SearchFilters = {
      q: string;
      language?: string;
      limit?: number;
      page?: number;
    };

    const searchFilters: SearchFilters = {
      q: title,
      limit: limit || 10,
      page: page || 1,
    };

    if (language) {
      searchFilters.language = language;
    }

    const works = await this.openbook.search(searchFilters);
    return works;
  }

  async findOne(openlibrary_id: string) {
    const existingWork = await this.prisma.works.findUnique({
      where: { openlibrary_id },
      include: {
        works_authors: {
          include: {
            authors: true,
          },
        },
        reviews: {
          include: {
            users: true,
          },
        },
      },
    });

    if (existingWork) {
      return existingWork;
    }

    const work = await this.openbook.getWork(openlibrary_id);

    if (work) {
      const workToCreate: CreateWorkDto = {
        openlibrary_id,
        title: work.title || 'No Title',
      };
      if (work.first_publish_date) {
        const year = parseInt(work.first_publish_date);
        if (!isNaN(year)) {
          workToCreate.first_publish_year = year;
        }
      }
      workToCreate.covers = work.covers?.map((cover) => cover.toString());
      workToCreate.description = work.description;
      workToCreate.excerpts = work.excerpts;
      workToCreate.subjects = work.subjects || [];

      const createdWork = await this.create(workToCreate);

      const authorIds: string[] = [];

      if (work.authors && work.authors.length > 0) {
        if (work.authors.length < 5) {
          for (const authorObj of work.authors) {
            const authorOlid = authorObj.key.split('/').pop();

            if (authorOlid) {
              const author = await this.authorService.findOne(authorOlid);
              if (author) {
                authorIds.push(author.id);
              }
            }
          }

          for (const authorId of authorIds) {
            const existingRelation = await this.prisma.works_authors.findFirst({
              where: {
                work_id: createdWork.id,
                author_id: authorId,
              },
            });
            if (existingRelation) {
              continue;
            }
            await this.prisma.works_authors.create({
              data: {
                work_id: createdWork.id,
                author_id: authorId,
              },
            });
          }
        } else {
          const variousAuthorId = `eee1babe-52c4-477c-b9e4-3be6a487f565`;
          await this.prisma.works_authors.create({
            data: {
              work_id: createdWork.id,
              author_id: variousAuthorId,
            },
          });
        }
      }

      return await this.prisma.works.findUnique({
        where: { openlibrary_id },
        include: {
          works_authors: {
            include: {
              authors: true,
            },
          },
          reviews: {
            include: {
              users: true,
            },
          },
        },
      });
    }
  }

  create(data: CreateWorkDto) {
    return this.prisma.works.create({ data });
  }

  update(id: string, data: Partial<CreateWorkDto>) {
    return this.prisma.works.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.works.delete({ where: { id } });
  }

  getCommmunityReviews(
    work_id: string,
    limit?: number,
    offset?: number,
    exclude_user_id?: string, // optional
  ) {
    const where: {
      work_id: string;
      user_id?: { not: string };
    } = { work_id };

    if (exclude_user_id) {
      where.user_id = { not: exclude_user_id }; 
    }

    return this.prisma.reviews.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { created_at: 'desc' },
      include: {
        users: true,
      },
    });
  }
}
