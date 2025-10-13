import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import { roundsOfHashing } from 'src/users/users.controller';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto): Promise<AuthEntity> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password`);
    }

    return {
      accessToken: this.jwtService.sign({
        userId: user.id,
      }),
    };
  }

  async register({
    email,
    username,
    password,
  }: RegisterDto): Promise<AuthEntity> {
    const hashedPassword = await bcrypt.hash(password, roundsOfHashing);
    password = hashedPassword;

    const user = await this.prisma.users.create({
      data: { email, username, password },
    });
    return {
      accessToken: this.jwtService.sign({
        userId: user.id,
      }),
    };
  }
}
