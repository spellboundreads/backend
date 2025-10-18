import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShelvesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.shelvesUncheckedCreateInput) {
    return this.prisma.shelves.create({ data });
  }

  findAll() {
    return this.prisma.shelves.findMany();
  }

  findOne(id: string) {
    return this.prisma.shelves.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.shelvesUncheckedUpdateInput) {
    return this.prisma.shelves.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.shelves.delete({ where: { id } });
  }

  addWorkToShelf(shelfId: string, workId: string) {
    return this.prisma.works_shelves.create({
      data: {
        shelf_id: shelfId,
        work_id: workId,
      },
    });
  }

  removeWorkFromShelf(shelfId: string, workId: string) {
    return this.prisma.works_shelves.deleteMany({
      where: {
        shelf_id: shelfId,
        work_id: workId,
      },
    });
  }
}
