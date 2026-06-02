import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from './common/guards/jwt.guard';
import { PrismaService } from './prisma/prisma.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  const prismaService = app.get(PrismaService);

  app.useGlobalGuards(new JwtGuard(jwtService, reflector, prismaService));

  app.setGlobalPrefix('api/v1');

  // Serve uploaded files as static assets at /uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
