import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { WordsService } from './words.service';
import { GamesService } from './games.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.schema';
import { User, UserSchema } from 'src/users/user.schema';
import { Word, WordSchema } from './word.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/users/auth.service';
import { AppService } from 'src/app.service';
import { AppModule } from 'src/app.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Game.name, schema: GameSchema },
            { name: User.name, schema: UserSchema },
            { name: Word.name, schema: WordSchema }
        ])
    ],
    //imports: [TypeOrmModule.forFeature([Words, Games])],
    controllers: [GamesController],
    providers: [WordsService, GamesService],
    exports: [WordsService, GamesService]
})
export class GamesModule {}
