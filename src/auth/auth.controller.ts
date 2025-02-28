import { Controller, Get, Post, Render, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @Render('login') 
  getLoginPage() {
    return { error: null };
  }

  @Get('/register')
  @Render('register')  
  getRegisterPage() {
    return { error: null };
  }

  @Post('/register')
  async register(@Body() body, @Res() res) {
    const { email, password, confirmPassword, nickname } = body;

    if (password !== confirmPassword) {
      return res.render('register', { error: 'Passwords do not match' });
    }
    
    try {
      await this.authService.register(email, password, nickname);
      return res.redirect('/auth/login');
    } catch (error) {
      return res.render('register', { error: error.message });
    }
  }

  @Post('/login')
  async login(@Body() body, @Res() res) {
    try {
      const { email, password } = body;
      const { token } = await this.authService.login(email, password);

      res.cookie('auth_token', token, { httpOnly: true });
      return res.redirect('/dashboard'); // Redirect to a protected page
    } catch (error) {
      return res.render('login', { error: 'Invalid credentials' });
    }
  }

  @Get('/logout')
  logout(@Res() res) {
    res.clearCookie('auth_token');
    return res.redirect('/auth/login');
  }
}
