import { faker } from '@faker-js/faker';
import request from 'supertest';
import { appBuilder } from '../../src/app';
import { prisma, cleanDB } from '../../src/database/prisma';
import { UserFactory } from '../../src/factories/user.factory';
import { ProductFactory } from '../../src/factories/product.factory';

const app = appBuilder();

jest.setTimeout(1000 * 30);

describe('Cart (e2e)', () => {
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

    describe('api/v1/cart (addToCart) [post]', () => {
        it('should be able to add a product to cart', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .post(`/api/v1/cart/addToCart`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    productId: product.id,
                    quantity: 1,
                });

            expect(res.status).toEqual(201);
            expect(res.body.message).toEqual('Product added to cart');
        });

        it('should be able to not add a product to cart as manager', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .post(`/api/v1/cart/addToCart`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    productId: product.id,
                    quantity: 1,
                });

            expect(res.status).toEqual(403);
            expect(res.body.message).toEqual('This resource is only available for clients');
        });

        it('should be able to not add a product to cart with invalid data', async () => {
            const res = await request(app)
                .post(`/api/v1/cart/addToCart`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    productId: 'abc',
                    qty: 's',
                });

            expect(res.status).toEqual(422);
            expect(res.body.errors).toBeDefined();
        });

        it('should be able to not add a product to cart with invalid token', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .post(`/api/v1/cart/addToCart`)
                .set('Authorization', `Bearer ${faker.random.alphaNumeric(10)}`)
                .send({
                    productId: product.id,
                    qty: 1,
                });

            expect(res.status).toEqual(401);
            expect(res.text).toEqual('Unauthorized');
        });

        it('should be able to not add a product to cart with invalid product id', async () => {
            const res = await request(app)
                .post(`/api/v1/cart/addToCart`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    productId: 9999,
                    qty: 1,
                });

            expect(res.status).toEqual(404);
            expect(res.body.message).toEqual('Product not found');
        });

        it('should be able to not add a product to cart with quantity greater than stock', async () => {
            const product = await productFactory.makeUsingData({
                stock: 1,
                category: 'test',
                description: 'test',
                name: 'test',
                price: 1,
                image: 'test',
            });

            const res = await request(app)
                .post(`/api/v1/cart/addToCart`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    productId: product.id,
                    qty: 98,
                });
            expect(res.status).toEqual(400);
            expect(res.body.message).toEqual('Not enough stock');
        });
    });
});
