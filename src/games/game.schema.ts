import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/user.schema';
import { Word } from './word.schema';

export type GameDocument = Game & Document;

export class Players {
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

    @Prop()
    lang: string;

    @Prop({ type: mongoose.Schema.Types.Array })
    users: Players[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
