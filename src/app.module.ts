import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthorsModule } from './authors/authors.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorksModule } from './works/works.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UsersModule, AuthorsModule, AuthModule, WorksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
