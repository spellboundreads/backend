import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.prisma.reviews.create({
      data: createReviewDto,
    });
  }

  async findAll() {
    return this.prisma.reviews.findMany({
      include: {
        users: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.reviews.findUnique({
      where: { id },
      include: {
        users: true,
        works: true,
      },
    });
  }

  update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.prisma.reviews.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  remove(id: string) {
    return this.prisma.reviews.delete({
      where: { id },
    });
  }

  like(user_id: string, review_id: string) {
    return this.prisma.review_likes.create({
      data: {
        user_id,
        review_id,
      },
    });
  }

  unlike(user_id: string, review_id: string) {
    return this.prisma.review_likes.deleteMany({
      where: {
        user_id,
        review_id,
      },
    });
  }
}
