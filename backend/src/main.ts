import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from './common/guards/jwt.guard';
import { PrismaService } from './prisma/prisma.service';

import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  const prismaService = app.get(PrismaService);

  app.useGlobalGuards(new JwtGuard(jwtService, reflector, prismaService));

  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
