import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { OpenbookService } from 'src/openbook/openbook.service';
import { WorkEntity } from './entities/work.entity';
import { AuthorsService } from 'src/authors/authors.service';
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
    if (
      !filters.title &&
      !filters.language &&
      !filters.limit &&
      !filters.page
    ) {
      return await this.prisma.works.findMany({
        take: 10,
        skip: 0,
        orderBy: {
          created_at: 'desc',
        },
      });
    }

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
    const results: WorkEntity[] = [];
    for (const work of works.docs) {
      let newWork;
      const existingWork = await this.findOne(work.key.split('/').pop() || '');
      if (!existingWork) {
        newWork = await this.findOne(work.key.split('/').pop() || '');
      }
      results.push(existingWork || newWork);
    }

    return results;
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
        for (const authorObj of work.authors) {
          const authorKey = authorObj.author.key;
          const authorOlid = authorKey.split('/').pop();

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
}
