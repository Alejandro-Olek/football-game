//app.controller
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  //login
  @Get()
  redirectToLogin(@Res() res: Response) {
    return res.redirect('/auth/login');
  }
  
}