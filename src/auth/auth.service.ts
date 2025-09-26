import { Get, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashRound = 10;
    const hashedPassword = await bcrypt.hash(dto.password, hashRound);
    const { password, ...userData } = dto;
    const user = await this.prisma.users.create({
      data: { ...userData, password_hash: hashedPassword },
    });
    return this.generateToken(user.id);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (!user)
      throw new UnauthorizedException('No users associated with this email');

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    return this.generateToken(user.id);
  }

  async generateToken(userId: string) {
    return {
      access_token: this.jwtService.sign({ id: userId }, { expiresIn: '24h' }),
    };
  }
}
