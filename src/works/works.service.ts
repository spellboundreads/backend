import { Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WorksService {
  constructor(private readonly prisma: PrismaService) {}
  create(createWorkDto: CreateWorkDto) {
    return 'This action adds a new work';
  }

  async findAll() {
    return await this.prisma.works.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.works.findUnique({
      where: { id },
    });
  }

  update(id: number, updateWorkDto: UpdateWorkDto) {
    return `This action updates a #${id} work`;
  }

  remove(id: number) {
    return `This action removes a #${id} work`;
  }
}
