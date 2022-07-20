import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GameDocument } from './game.schema';
import { GamesService } from './games.service';
import { WordsService } from './words.service';

describe('GamesService', () => {
    let service: GamesService;

    const fakeWordsService = {
        getWord: jest.fn().mockResolvedValue(() => ({
            id: 1,
            word: 'test',
            lang: 'eng'
        })),

        compareWords: jest.fn().mockImplementation(() => {
            return {
                guessed: true,
                result: {}
            };
        }),

        find: () => {}
    };

    class mockGameModel {
        constructor(private data) {}
        save = jest.fn().mockResolvedValue({
            id: 1,
            word: 1,
            length: 5,
            guesses: 6,
            players: [{ user: 1, guesses: [], guessed: true, gameOver: true }]
        });
        static findOne = jest.fn().mockImplementation(() =>
            Promise.resolve({
                id: 1,
                word: 1,
                length: 5,
                guesses: 6,
                players: [{ user: 1, guesses: [], guessed: true, gameOver: true }]
            })
        );

        populate = function () {
            return this;
        };
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GamesService,
                {
                    provide: WordsService,
                    useValue: fakeWordsService
                },
                {
                    provide: getModelToken('Game'),
                    useValue: mockGameModel
                }
            ]
        }).compile();

        service = module.get<GamesService>(GamesService);

        fakeWordsService.find = jest.fn().mockImplementation(() =>
            Promise.resolve({
                id: 1,
                word: 'test',
                lang: 'eng'
            })
        );

        jest.spyOn(service, 'findGame').mockResolvedValue({
            id: 1,
            word: { word: 'test', lang: 'eng' },
            length: 5,
            guesses: 6,
            players: []
        } as GameDocument);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return a game object when creating a game', async () => {
        const res = await service.createGame(1, 1, 'eng', false);
        expect(res).toBeDefined();
    });

    it('should throw an error if it couldnt find a game with the specified parameters', async () => {
        fakeWordsService.getWord = jest
            .fn()
            .mockImplementation(() => Promise.resolve(null));
        await expect(service.createGame(1, 1, 'eng', true)).rejects.toThrow(
            NotFoundException
        );
    });

    it('should throw an error if word is not found in dictionary when guessing', async () => {
        fakeWordsService.find = jest.fn().mockImplementation(() => Promise.resolve(null));
        await expect(
            service.guess('test', { email: 'asd@asd.com' }, { id: '1' })
        ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if no game was found', async () => {
        jest.spyOn(service, 'findGame').mockImplementation(() => Promise.resolve(null));
        await expect(
            service.guess('test', { email: 'asd@asd.com' }, { id: '1' })
        ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the word length is incorrect', async () => {
        await expect(
            service.guess('test', { email: 'asd@asd.com' }, { id: '1' })
        ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if no game was found when getting the state', async () => {
        jest.spyOn(service, 'findGame').mockImplementation(() => Promise.resolve(null));
        await expect(service.getState({ email: 'asd@asd.com' })).rejects.toThrow(
            NotFoundException
        );
    });
});
