import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesService } from './games/games.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                AppService,
                {
                    provide: GamesService,
                    useValue: {}
                }
            ]
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(appController).toBeDefined();
        });
    });
});
