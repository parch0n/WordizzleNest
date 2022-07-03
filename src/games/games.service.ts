import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Games } from './games.entity';
import { Words } from './words.entity';
import { WordsService } from './words.service';

@Injectable()
export class GamesService {
    constructor(
        private wordsService: WordsService,
        @InjectRepository(Games) private repo: Repository<Games>
    ) {}

    async createGame(length: number, guesses: number, lang: string) {
        const word = await this.wordsService.find(length, lang);
        if (!word) {
            throw new NotFoundException(
                "Couldn't find a word with the specified parameters"
            );
        }
        console.log(word);
        const word2 = new Words();
        word2.lang = 'asd';
        word2.word = 'minko';

        //const game = this.repo.create({ word2, length, guesses, lang });
        return this.repo.save({ word, length, guesses, lang });
        //return await
    }
}
