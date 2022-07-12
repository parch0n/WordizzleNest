import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ObjectIdDto } from '../games/dtos/objectId.dto';
import { Game, GameDocument } from '../games/game.schema';

@Injectable()
export class StatsService {
    constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

    async getStats(ObjId?: ObjectIdDto) {
        const game_id = ObjId.id || process.env.game_id;
        const stats = await this.gameModel.aggregate([
            {
                $lookup: {
                    from: 'words',
                    localField: 'word',
                    foreignField: '_id',
                    as: 'populated'
                }
            },
            {
                $unwind: '$players'
            },
            {
                $unwind: '$populated'
            },
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(game_id),
                    'players.gameOver': true
                }
            },
            {
                $project: {
                    _id: 1,
                    populated: 1,
                    'players.guessed': 1
                }
            }
        ]);

        if (!stats.length) {
            throw new NotFoundException('No completed games found!');
        }

        let games_won = 0;
        stats.forEach((el) => {
            if (el.players.guessed) games_won++;
        });

        return {
            id: stats[0]._id,
            word: stats[0].populated.word,
            total_games: stats.length,
            games_won,
            games_lost: stats.length - games_won
        };
    }
}
