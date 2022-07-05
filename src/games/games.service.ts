import {
    BadRequestException,
    Injectable,
    NotFoundException,
    Session
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument, Players } from './game.schema';
import { WordsService } from './words.service';
import { Model } from 'mongoose';
import { Word, WordDocument } from './word.schema';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersModule } from 'src/users/users.module';
import { AppService } from 'src/app.service';
import { check } from 'prettier';

@Injectable()
export class GamesService {
    constructor(
        private wordsService: WordsService,
        @InjectModel(Game.name) private gameModel: Model<GameDocument>,
        @InjectModel(Word.name) private wordModel: Model<WordDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async createGame(length: number, guesses: number, lang: string) {
        const word = await this.wordsService.generate(length, lang);
        if (!word) {
            throw new NotFoundException(
                "Couldn't find a word with the specified parameters"
            );
        }
        // console.log(word);
        let game = new this.gameModel({ word, length, guesses, lang });
        return game.save();
    }

    async guess(word: string, @CurrentUser() user) {
        if (word.length !== parseInt(process.env.GAME_WORD_LENGTH)) {
            throw new BadRequestException(
                `Incorrect word length! Word length must be ${process.env.GAME_WORD_LENGTH}`
            );
        }

        if (!(await this.wordsService.find(word))) {
            throw new NotFoundException('Word not found in the dictionary');
        }

        const game = await this.gameModel.findOne({
            _id: process.env.game_id,
            'users.user': user._id
        });

        if (!game) {
            const newGame = await this.gameModel.findOne({
                _id: process.env.game_id
            });
            const checkGuess = this.wordsService.compareWords(word, process.env.word);
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

        const player_index = game.users.findIndex(
            (e) => e.user.toString() === user._id.toString()
        );

        if (
            game.users[player_index].guesses.length >=
            parseInt(process.env.GAME_GUESSES_LIMIT)
        ) {
            throw new BadRequestException(`Game Over! No more tries left!`);
        }

        if (game.users[player_index].guessed) {
            throw new BadRequestException('Game Over! Word already guessed');
        }

        const checkGuess = this.wordsService.compareWords(word, process.env.word);
        const gameOver: boolean =
            checkGuess.guessed ||
            game.users[player_index].guesses.length + 1 >=
                parseInt(process.env.GAME_GUESSES_LIMIT)
                ? true
                : false;
        game.users[player_index].guesses.push(word);
        game.users[player_index].guessed = checkGuess.guessed;
        game.users[player_index].gameOver = gameOver;
        game.markModified('users');
        await game.save();
        return checkGuess.result;
    }

    async test2(@CurrentUser() user) {
        // console.log(process.env.word);
        // console.log(process.env.word_id);

        const game = await this.gameModel
            .findById('62c362b052b95bd5a39c9967')
            .populate('users.user', '', this.userModel)
            .populate('word', '-_id -lang', this.wordModel);
        return game;
    }
}
