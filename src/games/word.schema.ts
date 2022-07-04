import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WordDocument = Word & Document;

@Schema()
export class Word {
    @Prop()
    word: string;

    @Prop()
    lang: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);
