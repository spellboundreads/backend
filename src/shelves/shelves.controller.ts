import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  UnauthorizedException,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ShelvesService } from './shelves.service';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ShelfEntity } from './entities/shelf.entity';
import { AuthenticatedRequest } from 'src/users/users.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddWorkToShelfDto } from './dto/add-work-to-shelf.dto';

@Controller('shelves')
@ApiTags('shelves')
export class ShelvesController {
  constructor(private readonly shelvesService: ShelvesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ShelfEntity })
  async create(@Body() data: CreateShelfDto, @Req() req: AuthenticatedRequest) {
    if (!req.user || req.user.id !== data.user_id) {
      throw new UnauthorizedException();
    }
    return new ShelfEntity(await this.shelvesService.create(data));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ShelfEntity, isArray: true })
  async findAll(@Req() req: AuthenticatedRequest) {
    const shelves = await this.shelvesService.findAll();
    return shelves
      .filter((shelf) => shelf.is_public || shelf.user_id === req.user.id)
      .map((shelf) => new ShelfEntity(shelf));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ShelfEntity })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new UnauthorizedException(
        'You must be logged in to access shelves',
      );
    }

    const shelf = await this.shelvesService.findOne(id);
    if (!shelf) {
      throw new NotFoundException(`Shelf not found`);
    }

    if (!shelf.is_public && shelf.user_id !== req.user.id) {
      throw new UnauthorizedException('Access to this shelf is restricted');
    }

    return new ShelfEntity(shelf);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ShelfEntity })
  async update(
    @Param('id') id: string,
    @Body() updateShelfDto: UpdateShelfDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new UnauthorizedException(
        'You must be logged in to access shelves',
      );
    }

    const shelf = await this.shelvesService.findOne(id);
    if (!shelf) {
      throw new NotFoundException(`Shelf not found`);
    }

    if (shelf.user_id !== req.user.id) {
      throw new UnauthorizedException('Access to this shelf is restricted');
    }
    return new ShelfEntity(
      await this.shelvesService.update(id, updateShelfDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ShelfEntity })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException(
        'You must be logged in to access shelves',
      );
    }

    const shelf = await this.shelvesService.findOne(id);
    if (!shelf) {
      throw new NotFoundException(`Shelf not found`);
    }

    if (shelf.user_id !== req.user.id) {
      throw new UnauthorizedException('Access to this shelf is restricted');
    }

    return new ShelfEntity(await this.shelvesService.remove(id));
  }

  @Post(':id/works')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ShelfEntity })
  async addWorkToShelf(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddWorkToShelfDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { work_id: workId } = body;
    const shelf = await this.shelvesService.findOne(id);
    if (!shelf) {
      throw new NotFoundException(`Shelf not found`);
    }

    if (!req.user || req.user.id !== shelf.user_id) {
      throw new UnauthorizedException();
    }

    await this.shelvesService.addWorkToShelf(id, workId);
    return new ShelfEntity(shelf);
  }

  @Delete(':id/works/:workId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async removeWorkFromShelf(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('workId', ParseUUIDPipe) workId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const shelf = await this.shelvesService.findOne(id);
    if (!shelf) {
      throw new NotFoundException(`Shelf not found`);
    }

    if (!req.user || req.user.id !== shelf.user_id) {
      throw new UnauthorizedException();
    }

    await this.shelvesService.removeWorkFromShelf(id, workId);
    return {
      message: `Work with ID ${workId} removed from shelf successfully`,
    };
  }
}
