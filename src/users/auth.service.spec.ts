import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDocument } from './user.schema';
import { UsersService } from './users.service';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        fakeUsersService = {
            find: (email: string) =>
                Promise.resolve({
                    _id: 1,
                    email,
                    password:
                        '$2b$10$SnRKNXtfj4/TR.H/8Q6uxeTZsYOtimSGgeKqQLW/qPz3sCVU6BBY6'
                } as UserDocument),
            create: (email: string, password: string) =>
                Promise.resolve({ _id: 1, email, password } as UserDocument)
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('creates a new user', async () => {
        fakeUsersService.find = () => Promise.resolve(null);
        const user = await service.signup('test@test.com', 'asdfgh');
        expect(user).toBeDefined();
    });

    it('throws an error if email is already in use', async () => {
        await expect(service.signup('asd@asd.com', 'asdf')).rejects.toThrow(
            BadRequestException
        );
    });

    it('throws an error if email is wrong', async () => {
        fakeUsersService.find = () => Promise.resolve(null);
        await expect(service.signin('asd@asd.com', 'asdf')).rejects.toThrow(
            BadRequestException
        );
    });

    it('throws an error if password is wrong', async () => {
        await expect(service.signin('asd@asd.com', 'asdf')).rejects.toThrow(
            BadRequestException
        );
    });

    it('signs-in a user if email and password are correct', async () => {
        const user = await service.signin('test@test.com', 'asd');
        expect(user).toBeDefined();
    });
});
