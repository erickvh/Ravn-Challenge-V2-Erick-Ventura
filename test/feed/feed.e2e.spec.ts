import { faker } from '@faker-js/faker';
import request from 'supertest';
import { appBuilder } from '../../src/app';
import { prisma, cleanDB } from '../../src/database/prisma';
import { UserFactory } from '../../src/factories/user.factory';
import { ProductFactory } from '../../src/factories/product.factory';

const app = appBuilder();

jest.setTimeout(1000 * 30);

describe('Feed (e2e)', () => {
    let userFactory: UserFactory;
    let productFactory: ProductFactory;
    let tokenAdmin: string;
    let tokenClient: string;

    beforeAll(async () => {
        userFactory = new UserFactory(prisma);
        productFactory = new ProductFactory(prisma);

        const admin = await userFactory.make('manager');
        const client = await userFactory.make();

        const resAdmin = await request(app).post('/api/v1/login').send({
            email: admin.email,
            password: 'secret123',
        });

        const resClient = await request(app).post('/api/v1/login').send({
            email: client.email,
            password: 'secret123',
        });

        tokenAdmin = resAdmin.body.token;
        tokenClient = resClient.body.token;
    });

    afterAll(async () => {
        await cleanDB();
        await prisma.$disconnect();
    });

    describe('api/v1/feed (like) [post]', () => {
        it('should be able to like a product as client', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .post(`/api/v1/feed/like`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    productId: product.id,
                });

            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual('Product liked');
        });

        it('should be able to not like a product already liked it', async () => {
            const product = await productFactory.make();

            await request(app).post('/api/v1/feed/like').set('Authorization', `Bearer ${tokenClient}`).send({
                productId: product.id,
            });

            const res = await request(app)
                .post(`/api/v1/feed/like`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    productId: product.id,
                });

            expect(res.status).toEqual(422);
            expect(res.body.message).toEqual('You already liked this product');
        });

        it('should be able to not like a product that does not exist', async () => {
            const res = await request(app)
                .post(`/api/v1/feed/like`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    productId: 9999,
                });

            expect(res.status).toEqual(422);
            expect(res.body.message).toEqual('Product not found');
        });
    });
});
