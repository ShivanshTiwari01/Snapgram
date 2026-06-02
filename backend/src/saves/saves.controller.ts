import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { SavesService } from './saves.service';
import { CreateSaveDto } from './dto/createSave.dto';
import { type Request } from 'express';

@Controller('saves')
export class SavesController {
  constructor(private savesService: SavesService) {}

  @Post()
  savePost(@Body() dto: CreateSaveDto, @Req() req: Request) {
    return this.savesService.savePost(req.user!.userId, dto.postId);
  }

  @Delete(':id')
  unsavePost(@Param('id') id: string, @Req() req: Request) {
    return this.savesService.unsavePost(id, req.user!.userId);
  }

  @Get()
  getSavedPosts(@Req() req: Request) {
    return this.savesService.getSavedPosts(req.user!.userId);
  }
}
