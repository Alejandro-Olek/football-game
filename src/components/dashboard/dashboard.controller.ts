//src/components/dashboard/dashboard.controller.ts
import { Controller, Get, Post, Render, Res, Body, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly authService: AuthService, private readonly dashboardService: DashboardService) {}

  @Get()
  @Render('dashboard')
  async getDashboardPage(@Req() req, @Res() res) {
    try {
      const token = req.cookies?.auth_token;
      if (!token) {
        return res.redirect('/login');
      }
      const decodedToken = this.authService.verifyToken(token);
      const matches = await this.dashboardService.getActiveMatches();
      return { nickname: decodedToken.nickname, error: null, matches };
    } catch (error) {
      return res.redirect('/login');
    }
  }

  @Post('match')
async createMatch(@Req() req, @Res() res, @Body() body: any) {
  try {
    const { type, duration } = body;
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.redirect('/login');
    }
    const decodedToken = this.authService.verifyToken(token);

    // You can add basic validations here, for example:
    if (!['friendly', 'tournament', 'ranked'].includes(type)) {
      return res.status(400).json({ error: 'Invalid match type' });
    }
    const parsedDuration = Number(duration);
    if (isNaN(parsedDuration) || parsedDuration < 1) {
      return res.status(400).json({ error: 'Invalid duration' });
    }

    await this.dashboardService.createMatch(
      { type, duration: parsedDuration },
      decodedToken.nickname,
    );
    return res.redirect('/dashboard');
  } catch (error) {
    return res.status(400).json({ error: 'Error creating match' });
  }
}
}