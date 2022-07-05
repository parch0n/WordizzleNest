import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
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
    @UseGuards(AuthGuard)
    guess(@Body() body: WordDto, @CurrentUser() user, @Param() ObjId?: ObjectIdDto) {
        return this.gamesService.guess(body.word, user, ObjId);
    }

    @Post('/createCustomGame')
    @UseGuards(AuthGuard)
    createCustomGame(@Body() body: CustomGameDto) {
        return this.gamesService.createGame(body.length, body.guesses, body.lang);
    }
}
