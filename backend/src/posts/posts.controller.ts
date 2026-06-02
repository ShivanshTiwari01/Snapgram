import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostsService } from './posts.service';
import { type Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Post()
  create(@Body() dto: CreatePostDto, @Req() req: Request) {
    console.log('req user id', req.user);
    return this.postsService.create(dto, req.user!.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() req: Request,
  ) {
    return this.postsService.update(id, dto, req.user!.userId);
  }

  @Get(':id')
  fetchPost(@Param('id') id: string) {
    return this.postsService.fetchPost(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.deletePost(id, req.user!.userId);
  }

  @Get()
  fetchPosts(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.postsService.fetchPosts(+page, +limit);
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.postsService.search(q);
  }

  @Patch(':id/like')
  likePost(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.likePost(id, req.user!.userId);
  }
}
