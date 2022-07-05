import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument, Players } from './game.schema';
import { WordsService } from './words.service';
import { Model } from 'mongoose';
import { Word, WordDocument } from './word.schema';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User, UserDocument } from 'src/users/user.schema';
import { ObjectIdDto } from './dtos/objectId.dto';

@Injectable()
export class GamesService {
    constructor(
        private wordsService: WordsService,
        @InjectModel(Game.name) private gameModel: Model<GameDocument>,
        @InjectModel(Word.name) private wordModel: Model<WordDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async createGame(length: number, guesses: number, lang: string) {
        const word = await this.wordsService.getWord(length, lang);
        if (!word) {
            throw new NotFoundException(
                "Couldn't find a word with the specified parameters"
            );
        }

        // console.log(word);
        let game = new this.gameModel({ word, length, guesses, lang });
        game = await game.populate('word');
        return game.save();
    }

    async guess(word: string, @CurrentUser() user, ObjId?: ObjectIdDto) {
        console.log('URL passed ID', ObjId.id);
        const game_id = ObjId.id || process.env.game_id;
        console.log('Assigned game ID', game_id);
        if (!(await this.wordsService.find(word))) {
            throw new NotFoundException('Word not found in the dictionary');
        }

        const game = await this.gameModel
            .findOne({
                _id: game_id,
                'users.user': user._id
            })
            .populate('word');

        if (!game) {
            const newGame = await this.gameModel
                .findOne({
                    _id: game_id
                })
                .populate('word');
            const checkGuess = this.wordsService.compareWords(word, newGame.word.word);
            const player = new Players();
            player.user = user._id;
            player.guesses = [];
            player.guesses.push(word);
            player.guessed = checkGuess.guessed;
            player.gameOver = checkGuess.guessed;
            newGame.users.push(player);
            await newGame.save();
            return checkGuess.result;
        }

        const word_length = game.length;
        const guesses_limit = game.guesses;

        if (word.length !== word_length) {
            throw new BadRequestException(
                `Incorrect word length! Word length must be ${word_length}`
            );
        }

        const player_index = game.users.findIndex(
            (e) => e.user.toString() === user._id.toString()
        );

        if (game.users[player_index].guesses.length >= guesses_limit) {
            throw new BadRequestException(`Game Over! No more tries left!`);
        }

        if (game.users[player_index].guessed) {
            throw new BadRequestException('Game Over! Word already guessed');
        }

        const checkGuess = this.wordsService.compareWords(word, game.word.word);
        const gameOver: boolean =
            checkGuess.guessed ||
            game.users[player_index].guesses.length + 1 >= guesses_limit
                ? true
                : false;
        game.users[player_index].guesses.push(word);
        game.users[player_index].guessed = checkGuess.guessed;
        game.users[player_index].gameOver = gameOver;
        game.markModified('users');
        await game.save();
        return checkGuess.result;
    }

    async getState(@CurrentUser() user) {
        const game = await this.gameModel
            .findOne({
                _id: process.env.game_id,
                'users.user': user._id
            })
            .populate('word');

        if (!game) {
            throw new NotFoundException('User not found on the current game');
        }

        const guesses = game.users.find(
            (e) => e.user.toString() === user._id.toString()
        ).guesses;
        const state = new Array();
        guesses.forEach((el) => {
            state.push(this.wordsService.compareWords(el, game.word.word).result);
        });

        return state;
    }
}
