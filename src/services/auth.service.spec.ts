import { cleanDB, prisma } from '../database/prisma';
import { UserFactory } from '../factories/user.factory';
import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { IUserRequest } from '../interfaces/auth/user';

describe('AuthService', () => {
    let userFactory: UserFactory;

    beforeAll(() => {
        userFactory = new UserFactory(prisma);
    });

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await cleanDB();
        await prisma.$disconnect();
    });

    it('should be defined factory', () => {
        expect(userFactory).toBeDefined();
    });

    describe('singup', () => {
        let email: string;
        let password: string;
        let name: string;

        beforeAll(() => {
            email = faker.internet.email();
            password = faker.internet.password();
            name = faker.name.fullName();
        });

        it('should be able to create a new user', async () => {
            const user = await AuthService.singUp({ email, password, name });
            expect(user).toBeDefined();
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('role');
            expect(user.role.name).toBe('client');
        });

        it("should'nt be able to create same user", async () => {
            await expect(AuthService.singUp({ email, password, name })).rejects.toThrowError('User already exists');
        });
    });

    describe('login', () => {
        let email: string;
        let password: string;
        let name: string;

        beforeAll(async () => {
            email = faker.internet.email();
            password = faker.internet.password();
            name = faker.name.fullName();
        });

        it('should be able to login', async () => {
            const user = await userFactory.makeUsingData({ email, password, name });

            const token = await AuthService.logIn({ email, password } as IUserRequest);
            expect(token).toBeDefined();
            expect(typeof token).toEqual('string');
        });

        it("should'nt be able to login with invalid password", async () => {
            await expect(
                AuthService.logIn({ email, password: 'password-invalid' } as IUserRequest),
            ).rejects.toThrowError('Invalid password');
        });

        it("should'nt be able to login with invalid email", async () => {
            await expect(AuthService.logIn({ email: 'email-invalid', password } as IUserRequest)).rejects.toThrowError(
                'User not found',
            );
        });
    });

    describe('logout', () => {
        let email: string;
        let password: string;
        let name: string;

        beforeAll(async () => {
            email = faker.internet.email();
            password = faker.internet.password();
            name = faker.name.fullName();
            await userFactory.makeUsingData({ email, password, name });
        });

        it('should be able to logout', async () => {
            const token = await AuthService.logIn({ email, password } as IUserRequest);
            expect(token).toBeDefined();
            expect(typeof token).toEqual('string');

            const logout = await AuthService.logOut(token);
            expect(logout).toBeDefined();
            expect(typeof logout).toEqual('boolean');
            expect(logout).toEqual(true);
        });

        it("should'nt be able to logout with invalid token", async () => {
            await expect(AuthService.logOut('')).rejects.toThrowError('Token not found');
        });
    });

    describe('forgotPassword', () => {
        beforeAll(async () => {});

        it('should be able to forgot password', async () => {
            const user = await userFactory.make();
            const resetToken = await AuthService.forgotPassword({ email: user.email } as IUserRequest);
            expect(resetToken).toBeDefined();
            expect(typeof resetToken).toEqual('string');
        });

        it("should'nt be able to forgot password with invalid email", async () => {
            await expect(AuthService.forgotPassword({ email: 'email-invalid' } as IUserRequest)).rejects.toThrowError(
                'User not found',
            );
        });
    });

    describe('resetPassword', () => {
        it('should be able to reset password', async () => {
            const user = await userFactory.make();
            const resetToken = await AuthService.forgotPassword({ email: user.email } as IUserRequest);
            const newPassword = faker.internet.password();
            const userReseted = await AuthService.resetPassword(resetToken, {
                email: user.email,
                password: newPassword,
            } as IUserRequest);

            expect(userReseted).toBeDefined();
            expect(userReseted).toHaveProperty('email');
            expect(userReseted).toHaveProperty('name');
        });

        it("should'nt be able to reset password with invalid token", async () => {
            const newPassword = faker.internet.password();
            await expect(
                AuthService.resetPassword('token-invalid', {
                    email: 'email-invalid',
                    password: newPassword,
                } as IUserRequest),
            ).rejects.toThrowError('Token not found');
        });
    });
});
