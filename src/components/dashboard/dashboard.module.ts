//src/components/dashboard/dashboard.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entities/user.entity';
import { Match } from 'src/entities/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, Match])],
    controllers: [DashboardController],
    providers: [DashboardService, AuthService],
})
export class DashboardModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(DashboardController); // Protege todas las rutas de Dashboard
    }
}
