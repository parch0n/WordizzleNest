import { Body, Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { CustomGameDto } from './dtos/custom-game.dto';
import { ObjectIdDto } from './dtos/objectId.dto';
import { WordDto } from './dtos/word.dto';
import { GamesService } from './games.service';
import { WordsService } from './words.service';

@Controller('')
export class GamesController {
    constructor(private wordsService: WordsService, private gamesService: GamesService) {}

    @Post('/guess/:id?')
    guess(@Body() body: WordDto, @CurrentUser() user, @Param() ObjId?: ObjectIdDto) {
        return this.gamesService.guess(body.word, user, ObjId);
    }

    @Post('/createCustomGame')
    createCustomGame(@Body() body: CustomGameDto) {
        return this.gamesService.createGame(body.length, body.guesses, body.lang);
    }
}
