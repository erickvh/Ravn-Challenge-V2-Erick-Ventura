import { faker } from '@faker-js/faker';
import request from 'supertest';
import { appBuilder } from '../../src/app';
import { prisma, cleanDB } from '../../src/database/prisma';
import { UserFactory } from '../../src/factories/user.factory';
const app = appBuilder();

jest.setTimeout(1000 * 30);

describe('Auth (e2e)', () => {
    let userFactory: UserFactory;

    beforeAll(async () => {
        userFactory = new UserFactory(prisma);
    });

    afterAll(async () => {
        await cleanDB();
        await prisma.$disconnect();
    });

    describe('api/v1/login', () => {
        let email: string;
        let password: string;
        let name: string;

        beforeAll(async () => {
            email = faker.internet.email();
            password = faker.internet.password();
            name = faker.name.fullName();
            await userFactory.makeUsingData({ email, password, name });
        });

        it('It should login with existing values', async () => {
            const res = await request(app).post('/api/v1/login').send({ email, password });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it("It shouldn't login empty values", async () => {
            const response = await request(app).post('/api/v1/login').send({});

            expect(response.status).toBe(422);
        });

        it("It shouldn't login not existing user", async () => {
            const res = await request(app).post('/api/v1/login').send({ email: 'test', password: 'test' });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('User not found');
        });

        it("It shouldn't login not valid password", async () => {
            const fakerUser = await userFactory.make();
            const res = await request(app).post('/api/v1/login').send({ email: fakerUser.email, password: 'test' });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid password');
        });

        it('It should login without password', async () => {
            const res = await request(app).post('/api/v1/login').send({ email: 'test' });

            expect(res.status).toBe(422);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('api/v1/signup', () => {
        let email: string;
        let password: string;
        let name: string;

        beforeAll(async () => {
            email = faker.internet.email();
            password = faker.internet.password();
            name = faker.name.fullName();
        });

        it('It should signup with existing values', async () => {
            const res = await request(app).post('/api/v1/signup').send({ email, password, name });

            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.user).toBeDefined();
            expect(res.body.user.email).toBeDefined();
            expect(res.body.user.role).toBeDefined();
            expect(res.body.user.role.name).toBe('client');
        });

        it("It shouldn't signup empty values", async () => {
            const response = await request(app).post('/api/v1/signup').send({});

            expect(response.status).toBe(422);
            expect(response.body.errors).toBeDefined();
        });

        it("It shouldn't signup with existing user", async () => {
            const fakeUser = await userFactory.make();

            const res = await request(app)
                .post('/api/v1/signup')
                .send({ email: fakeUser.email, password: faker.internet.password(), name: faker.name.fullName() });

            expect(res.status).toBe(422);
            expect(res.body.message).toBe('User already exists');
        });

        it("It shouldn't signup with imcomplete data", async () => {
            const res = await request(app).post('/api/v1/signup').send({ email });

            expect(res.status).toBe(422);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('api/v1/logout', () => {
        let email: string;
        let password: string;
        let name: string;

        beforeAll(async () => {
            email = faker.internet.email();
            password = faker.internet.password();
            name = faker.name.fullName();
            await userFactory.makeUsingData({ email, password, name });
        });

        it('It should logout', async () => {
            const resToken = await request(app).post('/api/v1/login').send({ email, password });

            const token = resToken.body.token;

            const res = await request(app)
                .post('/api/v1/logout')
                .set({ Authorization: `Bearer ${token}` })
                .send();

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User has been logged out');
        });
    });
});
