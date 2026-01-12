import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/uploadfile';
import { GoogleAuthGuard } from 'src/common/guards/google.guard';
import type { Request, Response } from 'express';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage',multerOptions))
  register(@Body() data: CreateUserDto,@UploadedFile() profileImage:Express.Multer.File) {
    return this.authService.register(data,profileImage ? profileImage.path : undefined);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: Request,@Res() res: Response) {
    return this.authService.googleLogin(req, res);
  }
}
