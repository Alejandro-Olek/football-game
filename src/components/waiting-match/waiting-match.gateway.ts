// src/components/waiting-match/waiting-match.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchPlayer } from 'src/entities/match-player.entity';
import { User } from 'src/entities/user.entity';
import { WaitingMatchService } from './waiting-match.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class WaitingMatchGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => WaitingMatchService))
    private waitingMatchService: WaitingMatchService
  ) {}
  /**
   * Emite un evento a todos los clientes conectados a la sala de la partida.
   */
  emitNewPlayer(matchId: number, player: MatchPlayer, user: User) {
    // Usando una sala específica para cada partido, por ejemplo: "match_<matchId>"
    this.server.to(`match_${matchId}`).emit('newPlayer', player, user);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, room: string): Promise<void> {
    client.join(room);
    // Extraer el matchId de la sala, asumiendo que el room es del formato "match_<matchId>"
    const matchId = parseInt(room.split('_')[1], 10);
    // Consultar la lista de jugadores para ese match
    const players = await this.waitingMatchService.getPlayersByMatch(matchId);
    // Enviar la lista de jugadores al cliente que se ha unido
    client.emit('currentPlayers', players);
  }

  async handleDisconnect(client: Socket) {
    const { matchId, userId } = client.data; // Asegúrate de haber almacenado estos datos al unirse
    if (matchId && userId) {
      // Llamamos al servicio para remover al jugador de la base de datos
      await this.waitingMatchService.removePlayerFromMatch(matchId, userId);
      // Emitir evento a la sala para notificar que el jugador ha abandonado
      this.server.to(`match_${matchId}`).emit('playerLeft', { userId });
    }
  }

}