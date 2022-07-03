import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Repository } from 'typeorm';
import { workerData } from 'worker_threads';
import { Words } from './words.entity';

@Injectable()
export class WordsService {
    constructor(@InjectRepository(Words) private repo: MongoRepository<Words>) {}
    async find(length: number, lang: string) {
        const word: any = await this.repo
            .aggregate([
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
            ])
            .toArray();
        return word[0].word;
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
