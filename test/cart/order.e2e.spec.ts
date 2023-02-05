import request from 'supertest';
import { appBuilder } from '../../src/app';
import { prisma, cleanDB } from '../../src/database/prisma';
import { UserFactory } from '../../src/factories/user.factory';
import { ProductFactory } from '../../src/factories/product.factory';

const app = appBuilder();

jest.setTimeout(1000 * 30);

describe('Order (e2e)', () => {
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

    describe('api/v1/orders (checkout) [post]', () => {
        it('should be able to checkout as client', async () => {
            const product = await productFactory.make();

            await request(app).post(`/api/v1/cart/addToCart`).set('Authorization', `Bearer ${tokenClient}`).send({
                productId: product.id,
                quantity: 1,
            });

            const res = await request(app)
                .post(`/api/v1/orders/checkout`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    address: 'Rua 1',
                });

            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual('Order placed successfully');
            expect(res.body.order).toHaveProperty('orderId');
            expect(res.body.order).toHaveProperty('total');
            expect(res.body.order).toHaveProperty('address');
            expect(res.body.order).toHaveProperty('items');
            expect(res.body.order.items.length).toBeGreaterThan(0);
        });

        it('should be able to not checkout as manager', async () => {
            const product = await productFactory.make();

            await request(app).post(`/api/v1/cart/addToCart`).set('Authorization', `Bearer ${tokenClient}`).send({
                productId: product.id,
                quantity: 1,
            });

            const res = await request(app)
                .post(`/api/v1/orders/checkout`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    address: 'Rua 1',
                });
            expect(res.status).toEqual(403);
            expect(res.body.message).toEqual('This resource is only available for clients');
        });

        it('should be able to not checkout as guest', async () => {
            const product = await productFactory.make();

            const res = await request(app).post(`/api/v1/orders/checkout`).send({
                address: 'Rua 1',
            });
            expect(res.status).toEqual(401);
            expect(res.text).toEqual('Unauthorized');
        });

        it('should be able to not checkout with invalid address', async () => {
            const product = await productFactory.make();

            await request(app).post(`/api/v1/cart/addToCart`).set('Authorization', `Bearer ${tokenClient}`).send({
                productId: product.id,
                quantity: 1,
            });

            const res = await request(app)
                .post(`/api/v1/orders/checkout`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    address: '',
                });
            expect(res.status).toEqual(422);
            expect(res.body.errors).toBeDefined();
        });

        it('should be able to not checkout with invalid cart', async () => {
            await request(app).post(`/api/v1/orders/checkout`).set('Authorization', `Bearer ${tokenClient}`).send({
                address: 'Rua 1',
            });
            const res = await request(app)
                .post(`/api/v1/orders/checkout`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    address: 'Rua 1',
                });
            expect(res.status).toEqual(404);
            expect(res.body.message).toEqual('Cart not found');
        });
    });

    describe('api/v1/orders (my-orders) [get]', () => {
        it('should not be able to get orders as manager', async () => {
            const res = await request(app).get(`/api/v1/orders/my-orders`).set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.status).toEqual(403);
            expect(res.body.message).toEqual('This resource is only available for clients');
        });

        it('should not be able to get orders as guest', async () => {
            const res = await request(app).get(`/api/v1/orders/my-orders`);

            expect(res.status).toEqual(401);
            expect(res.text).toEqual('Unauthorized');
        });

        it('should be able to get orders as client', async () => {
            const product = await productFactory.make();

            await request(app).post(`/api/v1/cart/addToCart`).set('Authorization', `Bearer ${tokenClient}`).send({
                productId: product.id,
                quantity: 1,
            });

            await request(app).post(`/api/v1/orders/checkout`).set('Authorization', `Bearer ${tokenClient}`).send({
                address: 'Rua 1',
            });

            const res = await request(app)
                .get(`/api/v1/orders/my-orders`)
                .set('Authorization', `Bearer ${tokenClient}`);

            expect(res.status).toEqual(200);
            expect(res.body.orders.length).toBeGreaterThan(0);
            expect(res.body.orders[0]).toHaveProperty('orderId');
            expect(res.body.orders[0]).toHaveProperty('total');
        });
    });

    describe('api/v1/orders (users/id) [post]', () => {
        it('should be able to get order by id as manager', async () => {
            const product = await productFactory.make();

            await request(app).post(`/api/v1/cart/addToCart`).set('Authorization', `Bearer ${tokenClient}`).send({
                productId: product.id,
                quantity: 1,
            });

            const resCheckout = await request(app)
                .post(`/api/v1/orders/checkout`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    address: 'Rua 1',
                });

            const res = await request(app)
                .get(`/api/v1/orders/users/${resCheckout.body.order.user.id}`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.status).toEqual(200);
            expect(res.body.orders.length).toBeGreaterThan(0);
            expect(res.body.orders[0]).toHaveProperty('orderId');
            expect(res.body.orders[0]).toHaveProperty('total');
        });

        it('should not be able to get order by id as client', async () => {
            const product = await productFactory.make();

            await request(app).post(`/api/v1/cart/addToCart`).set('Authorization', `Bearer ${tokenClient}`).send({
                productId: product.id,
                quantity: 1,
            });

            const resCheckout = await request(app)
                .post(`/api/v1/orders/checkout`)
                .set('Authorization', `Bearer ${tokenClient}`)
                .send({
                    address: 'Rua 1',
                });

            const res = await request(app)
                .get(`/api/v1/orders/users/${resCheckout.body.order.user.id}`)
                .set('Authorization', `Bearer ${tokenClient}`);

            expect(res.status).toEqual(403);
            expect(res.body.message).toEqual('You are not allowed to access this resource');
        });
    });
});
