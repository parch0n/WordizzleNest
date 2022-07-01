import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthService } from './users/auth.service';
import { WordsService } from './games/words.service';
import { StatsService } from './games/stats.service';

@Module({
    imports: [UsersModule, GamesModule],
    controllers: [AppController],
    providers: [AppService, AuthService, WordsService, StatsService]
})
export class AppModule {}
