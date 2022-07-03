import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './games.controller';
import { Words } from './words.entity';
import { WordsService } from './words.service';
import { GamesService } from './games.service';
import { Games } from './games.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Words, Games])],
    controllers: [GamesController],
    providers: [WordsService, GamesService]
})
export class GamesModule {}
