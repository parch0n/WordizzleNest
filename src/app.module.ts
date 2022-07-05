import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { StatsModule } from './stats/stats.module';
import { GamesService } from './games/games.service';
import { WordsService } from './games/words.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users/users.service';
import { Game, GameSchema } from './games/game.schema';
import { Word, WordSchema } from './games/word.schema';
import { User, UserSchema } from './users/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        MongooseModule.forRoot('mongodb://localhost:27017/wordle'),
        MongooseModule.forFeature([
            { name: Game.name, schema: GameSchema },
            { name: Word.name, schema: WordSchema },
            { name: User.name, schema: UserSchema }
        ]),
        UsersModule,
        GamesModule
        //StatsModule
    ],
    /* imports: [
        TypeOrmModule.forRoot({
            type: 'mongodb',
            host: 'localhost',
            port: 27017,
            database: 'wordle',
            useUnifiedTopology: true,
            entities: [Users, Words, Games]
        }),
        UsersModule,
        GamesModule,
        StatsModule,
        TypeOrmModule.forFeature([Words, Games])
    ],*/
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true
            })
        }
    ]
})
export class AppModule {
    constructor(private configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                cookieSession({
                    keys: [this.configService.get<string>('COOKIE_KEY')] //encryption string
                })
            )
            .forRoutes('*');
    }
}
