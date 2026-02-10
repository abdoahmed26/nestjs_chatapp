/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/uploadfile';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller(`${process.env.API_VERSION}/messages`)
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5, multerOptions))
  create(@Body() data: CreateMessageDto, @UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.messagesService.create(userId, data, files ? files.map(file => file.path) : undefined);
  }

  @Get("conversation/:conversationId")  // :conversationId is conversation id
  findAll(@Param('conversationId') conversationId: string) {
    return this.messagesService.findAll(conversationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 5, multerOptions))
  update(@Param('id') id: string, @Body() data: UpdateMessageDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.messagesService.update(id, data, files ? files.map(file => file.path) : undefined);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
