import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument, Player } from './game.schema';
import { WordsService } from './words.service';
import { FilterQuery, Model } from 'mongoose';
import { Word, WordDocument } from './word.schema';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User, UserDocument } from '../users/user.schema';
import { ObjectIdDto } from './dtos/objectId.dto';

@Injectable()
export class GamesService {
    constructor(
        private wordsService: WordsService,
        @InjectModel(Game.name) private gameModel: Model<GameDocument>,
        @InjectModel(Word.name) private wordModel: Model<WordDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    private async findGame(filter: FilterQuery<GameDocument>): Promise<GameDocument> {
        return this.gameModel.findOne(filter).populate('word');
    }

    async createGame(length: number, guesses: number, lang: string) {
        const word = await this.wordsService.getWord(length, lang);
        if (!word) {
            throw new NotFoundException(
                "Couldn't find a word with the specified parameters"
            );
        }

        let game = new this.gameModel({ word, length, guesses, lang });
        game = await game.populate('word', '-_id');
        return game.save();
    }

    async guess(word: string, @CurrentUser() user, ObjId?: ObjectIdDto) {
        const game_id = ObjId.id || process.env.game_id;
        if (!(await this.wordsService.find(word))) {
            throw new NotFoundException('Word not found in the dictionary');
        }

        const game = await this.findGame({ _id: game_id });

        if (!game) {
            throw new NotFoundException('No game was found with the specified ID');
        }

        const word_length = game.length;
        const guesses_limit = game.guesses;

        if (word.length !== word_length) {
            throw new BadRequestException(
                `Incorrect word length! Word length must be ${word_length}`
            );
        }

        const player_index = game.players.findIndex(
            (e) => e.user.toString() === user._id.toString()
        );

        if (player_index === -1) {
            const newGame = await this.findGame({ _id: game_id });
            const checkGuess = this.wordsService.compareWords(word, newGame.word.word);
            const player = new Player();
            player.user = user._id;
            player.guesses = [];
            player.guesses.push(word);
            player.guessed = checkGuess.guessed;
            player.gameOver = checkGuess.guessed;
            newGame.players.push(player);
            await newGame.save();
            return checkGuess.result;
        }

        if (game.players[player_index].guesses.length >= guesses_limit) {
            throw new BadRequestException(`Game Over! No more tries left!`);
        }

        if (game.players[player_index].guessed) {
            throw new BadRequestException('Game Over! Word already guessed');
        }

        const checkGuess = this.wordsService.compareWords(word, game.word.word);
        const gameOver: boolean =
            checkGuess.guessed ||
            game.players[player_index].guesses.length + 1 >= guesses_limit
                ? true
                : false;
        game.players[player_index].guesses.push(word);
        game.players[player_index].guessed = checkGuess.guessed;
        game.players[player_index].gameOver = gameOver;
        game.markModified('players');
        await game.save();
        return checkGuess.result;
    }

    async getState(@CurrentUser() user) {
        const game = await this.findGame({
            _id: process.env.game_id,
            'players.user': user._id
        });

        if (!game) {
            throw new NotFoundException('User not found on the current game');
        }

        const guesses = game.players.find(
            (e) => e.user.toString() === user._id.toString()
        ).guesses;
        const state = new Array();
        guesses.forEach((el) => {
            state.push(this.wordsService.compareWords(el, game.word.word).result);
        });

        return state;
    }
}
