import { Expose, Transform } from 'class-transformer';
import { Schema } from 'mongoose';

export class UserDto {
    @Expose()
    @Transform((value) => value.obj._id)
    _id: Schema.Types.ObjectId;

    @Expose()
    email: string;
}
