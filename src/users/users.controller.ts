import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUserDto } from './dto/public-user.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    const user = await this.usersService.findOne(req.user.id);
    return plainToInstance(PublicUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(req.user.id, dto);
    if (!updatedUser) throw new NotFoundException('User not found');
    return plainToInstance(PublicUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return plainToInstance(PublicUserDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return plainToInstance(PublicUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
