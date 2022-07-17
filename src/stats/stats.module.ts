import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../games/game.schema';
import { GamesModule } from '../games/games.module';
import { Word, WordSchema } from '../games/word.schema';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }]),
        GamesModule
    ],
    controllers: [StatsController],
    providers: [StatsService]
})
export class StatsModule {}
