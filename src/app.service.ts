import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { GamesService } from './games/games.service';
import { WordsService } from './games/words.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(private gamesService: GamesService) {}

    async onApplicationBootstrap() {
        const game = await this.gamesService.createGame(
            parseInt(process.env.GAME_WORD_LENGTH),
            parseInt(process.env.GAME_GUESSES_LIMIT),
            process.env.GAME_LANG
        );
        process.env.game_id = game._id.toString();
        // console.log(process.env.game_id);
        console.log(game.word.word);
    }
}
