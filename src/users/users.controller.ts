import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from './entities/user.entity';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { isArray } from 'class-validator';
import { FollowUserDto } from './dto/follow-user.dto';
import { Request } from 'express';
import { ShelfEntity } from 'src/shelves/entities/shelf.entity';

export const roundsOfHashing = 10;
export interface AuthenticatedRequest extends Request {
  user: UserEntity;
}

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(req.user.id);

    if (!user) {
      throw new NotFoundException(`No user found`);
    }

    return new UserEntity(user);
  }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, roundsOfHashing);
    data.password = hashedPassword;

    return await this.usersService.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return new UserEntity(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || req.user.id !== id) {
      throw new UnauthorizedException();
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, roundsOfHashing);
    }
    return new UserEntity(await this.usersService.update(id, data));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (!req.user || req.user.id !== id) {
      throw new UnauthorizedException();
    }

    const deleted = await this.usersService.remove(id);
    if (!deleted) throw new NotFoundException('User not found');
    return new UserEntity(deleted);
  }

  @Get(':id/following')
  @ApiOkResponse()
  async getFollowing(@Param('id', ParseUUIDPipe) id: string) {
    const following = await this.usersService.getFollowing(id);
    if (isArray(following)) {
      return following.map((f) => {
        return new UserEntity(f.users_follows_following_idTousers);
      });
    }
    return [];
  }

  @Post('following')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiCreatedResponse()
  async follow(@Body() body: FollowUserDto, @Req() req: AuthenticatedRequest) {
    const { following_id } = body;
    if (!req.user) {
      throw new UnauthorizedException();
    }

    if (req.user.id === following_id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    return this.usersService.follow(req.user.id, following_id);
  }

  @Delete('following/:following_id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse()
  async unfollow(
    @Param('following_id', ParseUUIDPipe) following_id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    if (req.user.id === following_id) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    await this.usersService.unfollow(req.user.id, following_id);

    return { message: `Successfully unfollowed user ${following_id}` };
  }

  @Get(':id/followers')
  @ApiOkResponse()
  async getFollowers(@Param('id', ParseUUIDPipe) id: string) {
    const followers = await this.usersService.getFollowers(id);
    if (isArray(followers)) {
      return followers.map((f) => {
        return new UserEntity(f.users_follows_follower_idTousers);
      });
    }
    return [];
  }

  @Get(':id/shelves')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('token')
  @ApiOkResponse()
  async getShelves(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const includesPrivate = req.user.id === id;
    const shelves = await this.usersService.getShelves(id, includesPrivate);
    return {
      num_found: shelves.num_found,
      shelves: shelves.shelves.map((shelf) => {
        return new ShelfEntity(shelf);
      }),
    };
  }
}
