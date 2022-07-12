import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { isEmail } from 'class-validator';
import { stringify } from 'querystring';
import { User, UserDocument } from './user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;

    class mockUserModel {
        constructor(
            private dto: {
                email: string;
                password: string;
            }
        ) {}

        save() {
            const email = this.dto.email;
            const password = this.dto.password;

            return Promise.resolve({
                id: 1,
                email,
                password
            });
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken('User'),
                    useValue: mockUserModel
                }
            ]
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new user and return the user object', async () => {
        expect(await service.create('asd@asd.com', 'asdf')).toEqual({
            id: expect.any(Number),
            email: 'asd@asd.com',
            password: 'asdf'
        });
    });
});
