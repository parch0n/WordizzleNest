import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WordsService } from './words.service';

describe('WordsService', () => {
    let service: WordsService;

    const mockWordModel = {
        findOne: jest.fn().mockImplementation(() =>
            Promise.resolve({
                id: 1,
                word: 'test',
                lang: 'eng'
            })
        ),
        aggregate: jest.fn().mockImplementation(() =>
            Promise.resolve([
                {
                    id: 1,
                    word: 'test',
                    lang: 'eng'
                }
            ])
        )
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WordsService,
                {
                    provide: getModelToken('Word'),
                    useValue: mockWordModel
                }
            ]
        }).compile();

        service = module.get<WordsService>(WordsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return a word object when searching by word', async () => {
        expect(await service.find('test')).toEqual({
            id: expect.any(Number),
            word: 'test',
            lang: 'eng'
        });
    });

    it('should return a word object when trying to find a random word', async () => {
        expect(await service.getWord(4, 'eng')).toEqual({
            id: expect.any(Number),
            word: 'test',
            lang: 'eng'
        });
    });

    it('should return object consisting of guessed variable', () => {
        expect(service.compareWords('stick', 'broom').guessed).toBeDefined();
    });

    it('should return object consisting of result variable', () => {
        expect(service.compareWords('stick', 'broom').result).toBeDefined();
    });

    it('should return false when comparing different words', () => {
        expect(service.compareWords('stick', 'broom').guessed).toEqual(false);
    });

    it('should return true when comparing the same words', () => {
        expect(service.compareWords('stick', 'stick').guessed).toEqual(true);
    });
});
