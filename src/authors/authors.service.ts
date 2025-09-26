import { Injectable } from '@nestjs/common';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { PrismaService } from 'src/prisma.service';
import { authors as Author } from '@prisma/client';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorsDto: CreateAuthorsDto) {
    return await this.prisma.authors.create({ data: createAuthorsDto });
  }

  async findAll() {
    return await this.prisma.authors.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.authors.findUnique({
      where: { id },
    });
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
