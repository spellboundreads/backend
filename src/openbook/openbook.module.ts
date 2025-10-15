import { Module } from '@nestjs/common';
import { OpenbookService } from './openbook.service';

@Module({
  providers: [OpenbookService],
  exports: [OpenbookService],
})
export class OpenbookModule {}
