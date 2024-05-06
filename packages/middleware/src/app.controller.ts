import { Get } from '@nestjs/common';
import { GrpcService } from '@nestjs/microservices';
import { AppService } from './app.service.js';

@GrpcService()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
