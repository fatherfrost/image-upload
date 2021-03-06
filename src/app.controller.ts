import { Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalAuthGuard } from './authentication/local-auth.guard';
import { AuthService } from './authentication/auth.service';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async upload(
    @UploadedFile() image
  ) {
    return this.appService.upload(image.buffer);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(
    @Request() req
  ) {
    return this.authService.login(req.user);
  }
}
