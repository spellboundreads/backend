import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { PrismaModule } from '../prisma.module';
import { OpenbookModule } from 'src/openbook/openbook.module';

@Module({
  imports: [PrismaModule, OpenbookModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
