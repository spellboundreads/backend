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
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUserDto } from './dto/public-user.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from './entities/user.entity';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  // @Get('me')
  // async getMe(@Req() req) {
  //   const user = await this.usersService.findOne(req.user.id);
  //   return plainToInstance(PublicUserDto, user, {
  //     excludeExtraneousValues: true,
  //   });
  // }

  // @UseGuards(JwtAuthGuard)
  // @Patch('me')
  // async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
  //   const updatedUser = await this.usersService.update(req.user.id, dto);
  //   if (!updatedUser) throw new NotFoundException('User not found');
  //   return plainToInstance(PublicUserDto, updatedUser, {
  //     excludeExtraneousValues: true,
  //   });
  // }

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return new UserEntity(user);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updated = await this.usersService.update(id, updateUserDto);
    if (!updated) throw new NotFoundException('User not found');
    return new UserEntity(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.usersService.remove(id);
    if (!deleted) throw new NotFoundException('User not found');
    return new UserEntity(deleted);
  }
}
