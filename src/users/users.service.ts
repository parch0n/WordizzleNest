import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    create(email: string, password: string) {
        const user = new this.userModel({ email, password });
        return user.save();
    }

    find(email: string) {
        const user = this.userModel.findOne({ email }).lean();
        return user;
    }
}
