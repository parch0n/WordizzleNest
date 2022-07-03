import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private repo: Repository<Users>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    find(email: string) {
        return this.repo.findOne({ where: { email } });
    }
}
