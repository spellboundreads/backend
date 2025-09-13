import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
