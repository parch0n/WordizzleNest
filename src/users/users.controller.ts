import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    Get,
    Session,
    UseInterceptors,
    UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Users } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Post('/signup')
    async signup(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.email = user.email;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.email = user.email;
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.email = null;
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: Users) {
        return user;
    }
}
