import { Body, Controller, Post } from '@nestjs/common';
import { WordDto } from './dtos/word.dto';
import { GamesService } from './games.service';
import { WordsService } from './words.service';

@Controller('')
export class GamesController {
    constructor(private wordsService: WordsService, private gamesService: GamesService) {}

    @Post('/guess')
    guess(@Body() body: WordDto) {
        //return this.wordsService.find(5, 'bg');
        //return this, this.wordsService.compareWords(body.word, 'minko');
        return this.gamesService.createGame(5, 6, 'eng');
    }
}
