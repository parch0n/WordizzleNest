import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'src/games/game.schema';
import { GamesModule } from 'src/games/games.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
    controllers: [StatsController],
    providers: [StatsService]
})
export class StatsModule {}
