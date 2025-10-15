import { Module } from '@nestjs/common';
import { WorksService } from './works.service';
import { WorksController } from './works.controller';
import { OpenbookModule } from 'src/openbook/openbook.module';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  controllers: [WorksController],
  providers: [WorksService],
  imports: [OpenbookModule, AuthorsModule],
})
export class WorksModule {}
