import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { GamesService } from './games/games.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(private gamesService: GamesService) {}

    getHello(): string {
        return 'Hello World!';
    }

    onApplicationBootstrap() {
        return this.gamesService.createGame(5, 6, 'eng');
    }
}
