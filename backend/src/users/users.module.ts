import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const uploadDest = join(process.cwd(), 'uploads');
if (!existsSync(uploadDest)) {
  mkdirSync(uploadDest, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: uploadDest,
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB for avatars
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
