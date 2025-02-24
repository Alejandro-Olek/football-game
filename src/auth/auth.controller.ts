// src/auth/auth.controller.ts
import { Controller, Get, Post, Render, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @Render('login') 
  getLoginPage() {}

  @Get('/register')
  @Render('register')  
  getRegisterPage() {}

  @Post('/register')
  async register(@Body() body, @Res() res) {
    const { email, password, confirmPassword, nickname } = body;

    if (password !== confirmPassword) {
      return res.status(400).send('Las contraseñas no coinciden');
    }
    
    try {
      await this.authService.register(email, password, nickname);
      return res.redirect('/auth/login');
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  @Post('/login')
  async login(@Body() body, @Res() res) {
    try {
      const { email, password } = body;
      const { token } = await this.authService.login(email, password);

      res.cookie('auth_token', token, { httpOnly: true });
      return res.redirect('/dashboard'); // Redirigir a una página protegida
    } catch (error) {
      return res.status(401).send('Credenciales incorrectas');
    }
  }

  @Get('/logout')
  logout(@Res() res) {
    res.clearCookie('auth_token');
    return res.redirect('/auth/login');
  }
}