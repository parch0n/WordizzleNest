import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { WordDto } from './dtos/word.dto';
import { GamesService } from './games.service';
import { WordsService } from './words.service';

@Controller('')
export class GamesController {
    constructor(private wordsService: WordsService, private gamesService: GamesService) {}

    @Post('/guess')
    guess(@Body() body: WordDto, @CurrentUser() user) {
        //return this.wordsService.find(5, 'bg');
        //return this, this.wordsService.compareWords(body.word, 'minko');
        //return this.gamesService.createGame(5, 6, 'eng');
        return this.gamesService.guess(body.word, user);
    }

    //  @Get('/test')
    // test(@CurrentUser() user) {
    //     return this.gamesService.test(user);
    //}

    @Get('/test2')
    test2(@CurrentUser() user) {
        return this.gamesService.test2(user);
    }
}
