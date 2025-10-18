import { Injectable } from '@nestjs/common';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShelvesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createShelfDto: CreateShelfDto) {
    return this.prisma.shelves.create({ data: createShelfDto });
  }

  findAll() {
    return this.prisma.shelves.findMany();
  }

  findOne(id: string) {
    return this.prisma.shelves.findUnique({ where: { id } });
  }

  update(id: string, updateShelfDto: UpdateShelfDto) {
    return this.prisma.shelves.update({
      where: { id },
      data: updateShelfDto,
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
