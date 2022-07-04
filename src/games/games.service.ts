import { Injectable, NotFoundException, Session } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from './game.schema';
import { WordsService } from './words.service';
import { Model } from 'mongoose';
import { Word, WordDocument } from './word.schema';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';

@Injectable()
export class GamesService {
    constructor(
        private wordsService: WordsService,
        @InjectModel(Game.name) private gameModel: Model<GameDocument>,
        @InjectModel(Word.name) private wordModel: Model<WordDocument>
    ) {}

    async createGame(length: number, guesses: number, lang: string) {
        const word = await this.wordsService.find(length, lang);
        if (!word) {
            throw new NotFoundException(
                "Couldn't find a word with the specified parameters"
            );
        }
        // console.log(word);
        const game = new this.gameModel({ word, length, guesses, lang });
        return game.save();
    }

    async test(@CurrentUser() user) {
        //  console.log(user);

        const game = await this.gameModel.findById('62c242e65eb74f294011c165');
        game.user.push(user);
        return game.update(game);
        //const user =
        //  return this.gameModel.find().populate('word', '-_id -lang', this.wordModel);
        //return this.gameModel.find();
    }
}
