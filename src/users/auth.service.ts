import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const user = await this.usersService.find(email);
        if (user) {
            throw new BadRequestException('Email is already in use');
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await this.usersService.create(email, hash);
        return newUser;
    }

    async signin(email: string, password: string) {
        const user = await this.usersService.find(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Email or password is wrong');
        }

        return user;
    }
}
