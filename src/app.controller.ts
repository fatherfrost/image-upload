import { Controller, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/upload')
  getById(
    @Req() request: Request,
  ) {
    return this.appService.upload(request);
  }
}
