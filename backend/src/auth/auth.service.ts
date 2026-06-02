// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException('Email already in use');

    const hash = await bcrypt.hash(dto.password, 10);

    const derivedUsername = dto.username || dto.email.split('@')[0];
    const derivedName = dto.name || derivedUsername;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        username: derivedUsername,
        name: derivedName,
      },
    });

    return this.signToken(user.id, user.email);
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user.id, user.email);
  }

  async signout(token: string) {
    await this.prisma.blockedToken.create({
      data: { token },
    });

    return { message: 'Signed out successfully' };
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        imageUrl: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  private signToken(userId: string, email: string) {
    return {
      access_token: this.jwtService.sign({ userId, email }),
    };
  }
}
