import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health') 
  getHeath() {
    return {
      status: 'ok'
    };
  }

  @Get('hello')
  getHello() {
    return {
      "message": "Hello World!"
    };
  }
}
