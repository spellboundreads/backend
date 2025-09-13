import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { PrismaService } from 'src/prisma.service';
import { authors as Author } from '@prisma/client';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorsDto: CreateAuthorsDto) {
    try {
      return await this.prisma.authors.create({ data: createAuthorsDto });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Author already exists');
      }
      throw e;
    }
  }

  async findAll() {
    return await this.prisma.authors.findMany();
  }

  async findOne(id: string) {
    const author = await this.prisma.authors.findUnique({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    return author;
  }

  async update(id: string, updateAuthorsDto: UpdateAuthorsDto) {
    try {
      return await this.prisma.authors.update({
        where: { id },
        data: updateAuthorsDto,
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Unique constraint failed on update');
      }
      if (e.code === 'P2025') {
        throw new NotFoundException(`Author with id ${id} not found`);
      }
      throw e;
    }
  }

  async remove(id: string): Promise<Author> {
    try {
      return await this.prisma.authors.delete({
        where: { id },
      });
    } catch (e) {
      if (e?.code === 'P2025') {
        throw new NotFoundException(`Author with id ${id} not found`);
      }
      throw e;
    }
  }
}
