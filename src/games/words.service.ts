import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Word, WordDocument } from './word.schema';

@Injectable()
export class WordsService {
    constructor(@InjectModel(Word.name) private wordModel: Model<WordDocument>) {}

    async find(length: number, lang: string): Promise<Word> {
        const word = await this.wordModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $strLenCP: '$word' }, length]
                    },
                    lang
                }
            },
            {
                $sample: { size: 1 }
            }
        ]);
        return word[0];
    }

    compareWords(guess: string, target: string) {
        const buffer: number[] = [];
        const states: string[] = [];
        const result: { letter: string; state: string }[] = [];
        let guessed: boolean = true;

        [...guess].forEach((valueG, indexG) => {
            if (valueG === target[indexG]) {
                buffer[indexG] = 1;
                states[indexG] = 'green';
            }
        });

        [...guess].forEach((valueG, indexG) => {
            if (!states[indexG]) {
                let found = false;
                [...target].some((valueW, indexW) => {
                    if (valueG === valueW && !buffer[indexW]) {
                        //state = 'yellow';
                        buffer[indexW] = 1;
                        states[indexG] = 'yellow';
                        found = true;
                        return true;
                    }
                });
                if (!found && !states[indexG]) {
                    states[indexG] = 'gray';
                }
                guessed = false;
            }
        });

        [...guess].forEach((valueG, indexG) => {
            result.push({
                letter: guess[indexG],
                state: states[indexG]
            });
        });

        return {
            guessed,
            result
        };
    }
}
