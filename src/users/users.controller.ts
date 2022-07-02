import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Post('/signup')
    async signup(@Body() body: CreateUserDto) {
        const user = await this.authService.signup(body.email, body.password);
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto) {
        const user = await this.authService.signin(body.email, body.password);
        return user;
    }
}
