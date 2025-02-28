//src/components/waiting-match/waiting-match.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { WaitingMatchController } from './waiting-match.controller';
import { WaitingMatchService } from './waiting-match.service';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchPlayer } from '../../entities/match-player.entity';
import { User } from 'src/entities/user.entity';
import { Match } from 'src/entities/match.entity';
import { WaitingMatchGateway } from './waiting-match.gateway';
import { AuthService } from 'src/auth/auth.service';


@Module({
    imports: [TypeOrmModule.forFeature([MatchPlayer,Match, User])],
    controllers: [WaitingMatchController],
    providers: [WaitingMatchService, WaitingMatchGateway, AuthService],
})
export class WaitingMatchModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
         consumer
             .apply(AuthMiddleware)
             .forRoutes(WaitingMatchController); // Protege todas las rutas de WaitingMatch
    }
}