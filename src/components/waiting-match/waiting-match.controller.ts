import { Controller, Get, Post, Render, Res, Req, Query } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { WaitingMatchService } from './waiting-match.service';

@Controller('waiting-match')
export class WaitingMatchController {
  constructor(
    private readonly authService: AuthService,
    private readonly waitingMatchService: WaitingMatchService,
  ) {}

  @Get()
  @Render('waiting-match')
  async getWaitingMatchPage(@Req() req, @Res() res, @Query('id') matchId: string) {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.redirect('/login');
    }

    const decodedToken = this.authService.verifyToken(token);
    const userId = decodedToken.userId;
    
    // Se puede pasar el userId a la vista si es necesario
    return { matchId, userId, error: null };
  }

  @Post('join')
  async joinMatch(@Req() req, @Res() res, @Query('id') matchId: string) {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    
    const decodedToken = this.authService.verifyToken(token);
    const userId = decodedToken.id;

    try {
      const matchPlayer = await this.waitingMatchService.addPlayerToMatch(Number(matchId), userId);
      
      return res.status(201).json(matchPlayer);
    } catch (error) {
      return res.status(500).json({ message: 'Error al unirse a la partida', error });
    }
  }

  @Get('players')
  async getPlayers(@Query('id') matchId: string) {
    const players = await this.waitingMatchService.getPlayersByMatch(Number(matchId));
    return { players };
  }
}