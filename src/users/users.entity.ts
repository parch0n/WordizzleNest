import { Exclude, Expose, Transform } from 'class-transformer';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Users {
    @ObjectIdColumn()
    @Transform(({ value }) => value.toString())
    id: ObjectID;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;
}
