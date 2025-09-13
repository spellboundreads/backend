import { Injectable } from '@nestjs/common';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorsDto: CreateAuthorsDto) {
    return this.prisma.authors.create({
      data: createAuthorsDto,
    });
  }

  async findAll() {
    return this.prisma.authors.findMany();
  }

  async findOne(id: string) {
    return this.prisma.authors.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateAuthorsDto: UpdateAuthorsDto) {
    return this.prisma.authors.update({
      where: { id },
      data: updateAuthorsDto,
    });
  }

  remove(id: string) {
    return this.prisma.authors.delete({
      where: { id },
    });
  }
}
