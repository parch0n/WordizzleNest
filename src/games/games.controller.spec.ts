import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { WordsService } from './words.service';

describe('GamesController', () => {
    let controller: GamesController;
    const fakeGamesService = {
        guess: jest.fn().mockImplementation(() => {}),
        createGame: jest.fn().mockImplementation(() => {}),
        getState: jest.fn().mockImplementation(() => {})
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GamesController],
            providers: [
                {
                    provide: GamesService,
                    useValue: fakeGamesService
                }
            ]
        }).compile();

        controller = module.get<GamesController>(GamesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
