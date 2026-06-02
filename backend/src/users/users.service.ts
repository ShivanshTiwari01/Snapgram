import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private getFileUrl(file: Express.Multer.File): string {
    const host = process.env.APP_URL || 'http://localhost:3000';
    return `${host}/uploads/${file.filename}`;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        imageUrl: true,
        bio: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        imageUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findUserPosts(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.post.findMany({
      where: { creatorId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, name: true, imageUrl: true } },
        saves: true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    currentUserId: string,
    file?: Express.Multer.File,
  ) {
    if (id !== currentUserId)
      throw new ForbiddenException("Cannot update another user's profile");

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    const imageUrl = file ? this.getFileUrl(file) : undefined;
    const imageId = file ? file.filename : undefined;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        ...(imageUrl && { imageUrl }),
        ...(imageId && { imageId }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        imageUrl: true,
        bio: true,
        updatedAt: true,
      },
    });
  }
}
