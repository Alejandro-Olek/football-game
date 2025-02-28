//app.module
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import {WaitingMatchModule} from './components/waiting-match/waiting-match.module';

@Module({
  imports: [DatabaseModule, AuthModule, DashboardModule, WaitingMatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
