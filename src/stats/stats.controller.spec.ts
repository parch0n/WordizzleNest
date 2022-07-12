import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

describe('StatsController', () => {
    let controller: StatsController;
    const dto = {
        id: 1,
        word: 'test',
        total_games: 1,
        games_won: 1,
        games_lost: 1
    };

    let fakeStatsService = {
        getStats: jest.fn().mockImplementation(() => Promise.resolve(dto))
    };
    /*{
        getStats: (ObjId?) => {
            Promise.resolve({
                id: 1,
                word: 'test',
                total_games: 1,
                games_won: 1,
                games_lost: 1
            });
        }
    };*/

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StatsController],
            providers: [
                {
                    provide: StatsService,
                    useValue: fakeStatsService
                }
            ]
        }).compile();

        controller = module.get<StatsController>(StatsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get stats object', async () => {
        const obj = await controller.getStats({ id: '1' });
        expect(obj).toBeDefined();
    });
});
