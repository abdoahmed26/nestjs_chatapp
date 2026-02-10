/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/uploadfile';
import type { Request } from 'express';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller(`${process.env.API_VERSION}/conversations`)
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(@Body() data: CreateConversationDto, @UploadedFile() image: Express.Multer.File, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.conversationsService.create(data, userId, image ? image.path : undefined);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.conversationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(@Param('id') id: string, @Body() data: UpdateConversationDto, @UploadedFile() image: Express.Multer.File) {
    return this.conversationsService.update(id, data, image ? image.path : undefined);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.conversationsService.remove(id);
  }
}
