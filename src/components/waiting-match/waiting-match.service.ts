//src/components/waiting-match/waiting-match.service.ts
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchPlayer } from 'src/entities/match-player.entity';
import { WaitingMatchGateway  } from './waiting-match.gateway';
import { User } from 'src/entities/user.entity';

@Injectable()
export class WaitingMatchService {
  constructor(
    @InjectRepository(MatchPlayer)
    private matchPlayerRepository: Repository<MatchPlayer>,
    @Inject(forwardRef(() => WaitingMatchGateway))
    private waitingMatchGateway: WaitingMatchGateway,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addPlayerToMatch(matchId: number, userId: number): Promise<MatchPlayer> {
    // Obtener los jugadores ya registrados en la partida
    const players = await this.matchPlayerRepository.find({ where: { matchId } });
    const homeCount = players.filter(p => p.team === 'home').length;
    const awayCount = players.filter(p => p.team === 'away').length;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // Lógica de asignación:
    // Si la diferencia es >=2, asigna al equipo con menos jugadores; 
    // de lo contrario, asigna aleatoriamente.
    let team: 'home' | 'away';
    if (Math.abs(homeCount - awayCount) >= 2) {
      team = homeCount < awayCount ? 'home' : 'away';
    } else {
      team = Math.random() < 0.5 ? 'home' : 'away';
    }
    const matchPlayer = this.matchPlayerRepository.create({
      matchId,
      userId,
      team,
      position: 'forward', // posición por defecto
    });
      
    await this.matchPlayerRepository.save(matchPlayer);
  
    // Emitir el evento para notificar a los clientes conectados
    this.waitingMatchGateway.emitNewPlayer(matchId, matchPlayer, user);
  
    return matchPlayer;
  }

  // Obtener los jugadores de una partida
  async getPlayersByMatch(matchId: number): Promise<MatchPlayer[]> {
    return this.matchPlayerRepository.find({ where: { matchId } });
  }

  async removePlayerFromMatch(matchId: number, userId: number): Promise<void> {
    await this.matchPlayerRepository.delete({ matchId, userId });
  }
}