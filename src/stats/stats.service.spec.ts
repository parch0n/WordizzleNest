import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';

describe('StatsService', () => {
    let service: StatsService;

    let mockGameModel = {
        aggregate: jest.fn().mockImplementation(() => [])
    };

    const dto = {
        _id: 1,
        players: { guessed: true },
        populated: {
            _id: 123,
            word: 'shift',
            lang: 'eng'
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StatsService,
                {
                    provide: getModelToken('Game'),
                    useValue: mockGameModel
                }
            ]
        }).compile();

        service = module.get<StatsService>(StatsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should throw an error if no valid ID is provided', async () => {
        mockGameModel.aggregate = jest.fn().mockImplementation(() => []);
        await expect(service.getStats({ id: 'asd' })).rejects.toThrow(
            'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer'
        );
    });

    it('should throw an error if no games were found', async () => {
        mockGameModel.aggregate = jest.fn().mockImplementation(() => []);
        await expect(
            service.getStats({ id: '62c59cf35de99e320fb58264' })
        ).rejects.toThrow(NotFoundException);
    });

    it('should return a stats object', async () => {
        mockGameModel.aggregate = jest.fn().mockImplementation(() => [dto]);
        const obj = await service.getStats({ id: '62c59cf35de99e320fb58264' });
        expect(obj).toEqual({
            games_won: expect.any(Number),
            games_lost: expect.any(Number),
            total_games: expect.any(Number),
            word: dto.populated.word,
            id: dto._id
        });
    });
});
