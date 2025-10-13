import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OpenLibraryClient } from 'openbook.js';
import { CreateWorkDto } from './dto/create-work.dto';

@Injectable()
export class WorksService {
  constructor(private readonly prisma: PrismaService) {}

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

    const openbookClient = new OpenLibraryClient('spellbound');
    const works = await openbookClient.search(searchFilters);
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

    const openbookClient = new OpenLibraryClient('spellbound');
    const work = await openbookClient.getWork(openlibrary_id);

    if (work) {
      let firstPublishDate: Date | undefined = undefined;

      if (work.first_publish_date) {
        const parsed = new Date(work.first_publish_date);
        if (!isNaN(parsed.getTime())) {
          firstPublishDate = parsed;
        }
      }

      const createdWork: CreateWorkDto = {
        openlibrary_id,
        title: work.title || 'No Title',
      };
      createdWork.first_publish_date = firstPublishDate;
      createdWork.covers = work.covers?.map((cover) => cover.toString());
      createdWork.description =
        typeof work.description === 'string'
          ? work.description
          : work.description?.value;
      createdWork.excerpts = work.excerpts?.map((excerpt) =>
        typeof excerpt === 'string' ? excerpt : excerpt.excerpt,
      );
      createdWork.subjects = work.subjects || [];

      const newWork = await this.prisma.works.create({
        data: createdWork,
      });

      const newWorkId = newWork.id;
      const authorIds: string[] = [];

      if (work.authors && work.authors.length > 0) {
        const parseDate = (dateString?: string): Date | undefined => {
          if (!dateString) return undefined;
          const parsed = new Date(dateString);
          return isNaN(parsed.getTime()) ? undefined : parsed;
        };

        for (const authorRef of work.authors) {
          const authorKey = authorRef.author.key;
          const authorId = authorKey.split('/').pop();

          if (authorId) {
            let author = await this.prisma.authors.findUnique({
              where: { openlibrary_id: authorId },
            });

            if (!author) {
              const authorDetails = await openbookClient.getAuthor(authorId);
              if (authorDetails) {
                author = await this.prisma.authors.create({
                  data: {
                    openlibrary_id: authorId,
                    name: authorDetails.name || 'Unknown Author',
                    birth_date: parseDate(authorDetails.birth_date),
                    death_date: parseDate(authorDetails.death_date),
                    bio:
                      typeof authorDetails.bio === 'string'
                        ? authorDetails.bio
                        : authorDetails.bio?.value,
                    photos:
                      authorDetails.photos?.map((photo) => photo.toString()) ||
                      [],
                  },
                });
              }
            }

            if (author) {
              authorIds.push(author.id);
            }
          }
        }

        for (const authorId of authorIds) {
          await this.prisma.works_authors.create({
            data: {
              work_id: newWorkId,
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
