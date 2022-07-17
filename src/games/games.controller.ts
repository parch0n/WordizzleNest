import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CustomGameDto } from './dtos/custom-game.dto';
import { ObjectIdDto } from './dtos/objectId.dto';
import { WordDto } from './dtos/word.dto';
import { GamesService } from './games.service';

@Controller('')
export class GamesController {
    constructor(private gamesService: GamesService) {}

    @Post('/guess/:id?')
    @UseGuards(AuthGuard)
    guess(@Body() body: WordDto, @CurrentUser() user, @Param() ObjId?: ObjectIdDto) {
        return this.gamesService.guess(body.word, user, ObjId);
    }

    @Post('/createCustomGame')
    @UseGuards(AuthGuard)
    createCustomGame(@Body() body: CustomGameDto) {
        return this.gamesService.createGame(body.length, body.guesses, body.lang, false);
    }

    @Get('/state')
    @UseGuards(AuthGuard)
    getState(@CurrentUser() user) {
        return this.gamesService.getState(user);
    }
}
