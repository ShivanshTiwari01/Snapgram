import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private getFileUrl(file: Express.Multer.File): string {
    const host = process.env.APP_URL || `http://localhost:3000`;
    return `${host}/uploads/${file.filename}`;
  }

  async create(
    dto: CreatePostDto,
    creatorId: string,
    file: Express.Multer.File,
  ) {
    const imageUrl = this.getFileUrl(file);
    const imageId = file.filename;

    // Parse tags from comma-separated string if sent as plain text
    const tags: string[] = dto.tags
      ? typeof dto.tags === 'string'
        ? (dto.tags as string)
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : dto.tags
      : [];

    return this.prisma.post.create({
      data: {
        caption: dto.caption,
        imageUrl,
        imageId,
        location: dto.location,
        tags,
        creatorId,
      },
    });
  }

  async update(
    id: string,
    dto: UpdatePostDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.creatorId !== userId)
      throw new ForbiddenException('Not your post');

    const imageUrl = file ? this.getFileUrl(file) : undefined;
    const imageId = file ? file.filename : undefined;

    const tags = dto.tags
      ? typeof dto.tags === 'string'
        ? (dto.tags as string)
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : dto.tags
      : undefined;

    return this.prisma.post.update({
      where: { id },
      data: {
        ...(dto.caption && { caption: dto.caption }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(tags && { tags }),
        ...(imageUrl && { imageUrl }),
        ...(imageId && { imageId }),
      },
    });
  }

  async fetchPost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, imageUrl: true } },
        saves: true,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async deletePost(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');

    if (post.creatorId !== userId)
      throw new ForbiddenException('Not your post');

    await this.prisma.post.delete({ where: { id } });

    return { message: 'Post deleted successfully' };
  }

  async fetchPosts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: { select: { id: true, name: true, imageUrl: true } },
          saves: true,
        },
      }),
      this.prisma.post.count(),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async search(q: string) {
    return this.prisma.post.findMany({
      where: {
        caption: { contains: q, mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, name: true, imageUrl: true } },
        saves: true,
      },
    });
  }

  async likePost(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');

    const alreadyLiked = post.likes.includes(userId);

    return this.prisma.post.update({
      where: { id },
      data: {
        likes: alreadyLiked
          ? { set: post.likes.filter((uid) => uid !== userId) }
          : { push: userId },
      },
    });
  }
}
