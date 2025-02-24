// src/game/game.module.ts
import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
//import { GameService } from './game.service';

@Module({
  providers: [GameGateway],
})
export class GameModule {}