/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/uploadfile';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Request } from 'express';

@Controller(`${process.env.API_VERSION}/users`)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('limit') limit = 10, @Query('page') page = 1, @Query('search') search?: string) {
    return this.usersService.findAll(limit, page, search);
  }

  @Get('me')
  findMe(@Req() req: Request) {
    const id = (req as any).user.id;
    return this.usersService.findOne(id.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImage', multerOptions))
  update(@Param('id') id: string, @Body() data: UpdateUserDto, @UploadedFile() profileImage: Express.Multer.File) {
    return this.usersService.update(id, data, profileImage ? profileImage.path : undefined);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
