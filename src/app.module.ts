import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthService } from './users/auth.service';
import { WordsService } from './games/words.service';
import { StatsService } from './games/stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/users.entity';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mongodb',
            host: 'localhost',
            port: 27017,
            database: 'wordle',
            useUnifiedTopology: true,
            entities: [Users]
        }),
        UsersModule,
        GamesModule
    ],
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
export class AppModule {}
