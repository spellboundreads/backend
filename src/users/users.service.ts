import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.users.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findOne(id: string) {
    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.users.delete({
      where: { id },
    });
  }

  follow(followerId: string, followingId: string) {
    return this.prisma.follows.create({
      data: {
        follower_id: followerId,
        following_id: followingId,
      },
    });
  }

  unfollow(followerId: string, followingId: string) {
    return this.prisma.follows.deleteMany({
      where: {
        follower_id: followerId,
        following_id: followingId,
      },
    });
  }

  getFollowers(userId: string) {
    return this.prisma.follows.findMany({
      where: {
        following_id: userId,
      },
      include: {
        users_follows_follower_idTousers: true,
      },
    });
  }

  getFollowing(userId: string) {
    return this.prisma.follows.findMany({
      where: {
        follower_id: userId,
      },
      include: {
        users_follows_following_idTousers: true,
      },
    });
  }
}
