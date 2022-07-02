import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Users } from '../users.entity';
import { UsersService } from '../users.service';

declare global {
    namespace Express {
        interface Request {
            currentUser?: Users;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { email } = req.session || {};
        if (email) {
            const user = await this.usersService.find(email);
            req.currentUser = user;
        }
        next();
    }
}
