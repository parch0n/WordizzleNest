import { Injectable, OnApplicationBootstrap, Session } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { GamesService } from './games/games.service';
import { WordsService } from './games/words.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(private gamesService: GamesService, private wordService: WordsService) {}

    async onApplicationBootstrap() {
        const game = await this.gamesService.createGame(
            parseInt(process.env.GAME_WORD_LENGTH),
            parseInt(process.env.GAME_GUESSES_LIMIT),
            process.env.GAME_LANG
        );
        process.env.game_id = game._id.toString();
        process.env.word_id = game.word.toString();
        process.env.word = (await this.wordService.findById(game.word.toString())).word;
        console.log(process.env.word);
    }
}
