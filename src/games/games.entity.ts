import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Words } from './words.entity';

@Entity()
export class Games {
    @ObjectIdColumn()
    id: ObjectID;

    @Column((type) => Words)
    word: Words;

    @Column()
    length: number;

    @Column()
    guesses: number;

    @Column()
    lang: string;
}
