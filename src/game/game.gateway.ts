// src/game/game.gateway.ts
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway() // Aquí puedes configurar opciones como el puerto, CORS, etc.
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Socket.IO server inicializado');
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    console.log('Jugador se une:', data);
    // Ejemplo: un jugador se une a una sala de juego
    client.join(data.gameId);
    // Notificar a la sala que un jugador se ha unido
    this.server.to(data.gameId).emit('playerJoined', { player: data.player });
  }
}