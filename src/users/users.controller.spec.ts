import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { AuthService } from './auth.service';
import { UserDocument } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    const fakeUsersService: Partial<UsersService> = {};
    const fakeAuthService: Partial<AuthService> = {
        signin: (email: string, password: string) =>
            Promise.resolve({
                _id: 1,
                email,
                password
            } as UserDocument),
        signup: (email: string, password: string) =>
            Promise.resolve({
                _id: 1,
                email,
                password
            } as UserDocument)
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService
                }
            ]
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should update session and returns the user when signing up', async () => {
        const session = { email: null };
        const user = await controller.signup(
            { email: 'test@test.com', password: 'asdf' },
            session
        );
        expect(session.email).toEqual('test@test.com');
        expect(user).toBeDefined();
    });

    it('should update session and returns the user when signing in', async () => {
        const session = { email: null };
        const user = await controller.signin(
            { email: 'test@test.com', password: 'asdf' },
            session
        );
        expect(session.email).toEqual('test@test.com');
        expect(user).toBeDefined();
    });

    it('should signs-out the user and deletes email variable from session', () => {
        const session = { email: 'test@test.com' };
        controller.signOut(session);
        expect(session.email).toBeNull();
    });
});
