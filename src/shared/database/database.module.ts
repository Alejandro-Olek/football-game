import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity';
import { Match } from '../../entities/match.entity';
import { MatchPlayer } from '../../entities/match-player.entity';
import { MatchStatistics } from '../../entities/match-statistics.entity';
import { PlayerStatistics } from '../../entities/player-statistics.entity';
import { MatchAction } from '../../entities/match-action.entity';
import { Tournament } from '../../entities/tournament.entity';
import { TournamentMatch } from '../../entities/tournament-match.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [
          User, Match, MatchPlayer, MatchStatistics, 
          PlayerStatistics, MatchAction, Tournament, TournamentMatch
        ],
        synchronize: true, // ⚠️ Solo en desarrollo, en producción usa migraciones
        autoLoadEntities: true,
        ssl: { rejectUnauthorized: false }, // Para Neon.tech
      }),
    }),
  ],
})
export class DatabaseModule {}
