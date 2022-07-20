import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../users/user.schema';
import { Word } from './word.schema';

export type GameDocument = Game & Document;

export class Player {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop()
    guesses: string[];

    @Prop()
    guessed: boolean;

    @Prop()
    gameOver: boolean;
}

@Schema()
export class Game {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Word' })
    word: Word;

    @Prop()
    length: number;

    @Prop()
    guesses: number;

    @Prop({ type: mongoose.Schema.Types.Array })
    players: Player[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
