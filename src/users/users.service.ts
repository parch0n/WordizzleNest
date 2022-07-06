import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Query } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    create(email: string, password: string): Promise<UserDocument> {
        const user = new this.userModel({ email, password });
        return user.save();
    }

    async find(email: string): Promise<UserDocument> {
        return await this.userModel.findOne({ email });
    }
}
