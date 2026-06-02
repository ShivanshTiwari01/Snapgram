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
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostsService } from './posts.service';
import { type Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreatePostDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.postsService.create(dto, req.user!.userId, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postsService.update(id, dto, req.user!.userId, file);
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.postsService.search(q);
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

  @Patch(':id/like')
  likePost(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.likePost(id, req.user!.userId);
  }
}
