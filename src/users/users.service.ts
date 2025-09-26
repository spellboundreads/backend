import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { users as User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const users = await this.prisma.users.findMany();
      return users;
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return user;
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
