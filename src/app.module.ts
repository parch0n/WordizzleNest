import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/users.entity';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { StatsModule } from './stats/stats.module';
import { Words } from './games/words.entity';
import { Games } from './games/games.entity';
import { GamesService } from './games/games.service';
import { WordsService } from './games/words.service';
const cookieSession = require('cookie-session');

@Module({
    imports: [
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
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true
            })
        },
        GamesService,
        WordsService
    ]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                cookieSession({
                    keys: ['asfdfqwewqsda'] //encryption string
                })
            )
            .forRoutes('*');
    }
}
