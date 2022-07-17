import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { GamesService } from './games/games.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(private gamesService: GamesService) {}

    async onApplicationBootstrap() {
        const game = await this.gamesService.createGame(
            parseInt(process.env.GAME_WORD_LENGTH),
            parseInt(process.env.GAME_GUESSES_LIMIT),
            process.env.GAME_LANG,
            true
        );
        console.log(game._id.toString());
        console.log(game.word.word);
    }
}
