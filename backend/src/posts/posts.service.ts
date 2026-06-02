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

  async create(dto: CreatePostDto, creatorId: string) {
    console.log('creatorid: ', creatorId);

    return this.prisma.post.create({
      data: { ...dto, creatorId },
    });
  }

  async update(id: string, dto: UpdatePostDto, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.creatorId !== userId)
      throw new ForbiddenException('Not your post');

    return this.prisma.post.update({
      where: { id },
      data: dto,
    });
  }

  async fetchPost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, imageUrl: true } },
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
