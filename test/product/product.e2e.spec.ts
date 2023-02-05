import { faker } from '@faker-js/faker';
import request from 'supertest';
import { appBuilder } from '../../src/app';
import { prisma, cleanDB } from '../../src/database/prisma';
import { UserFactory } from '../../src/factories/user.factory';
import { ProductFactory } from '../../src/factories/product.factory';

const app = appBuilder();

jest.setTimeout(1000 * 30);

describe('Products (e2e)', () => {
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

    describe('api/v1/product (create) [post]', () => {
        it('It should create a product as admin', async () => {
            const product = {
                name: faker.commerce.productName(),
                price: Number(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                stock: faker.datatype.number(100),
                category: faker.commerce.department(),
            };

            const res = await request(app)
                .post('/api/v1/products')
                .set({ Authorization: `Bearer ${tokenAdmin}` })
                .send(product);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('product');
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Product created');
            expect(res.body.product).toHaveProperty('id');
            expect(res.body.product).toHaveProperty('name');
        });

        it('It should not create a product as client', async () => {
            const product = {
                name: faker.commerce.productName(),
                price: Number(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                stock: faker.datatype.number(100),
                category: faker.commerce.department(),
            };

            const res = await request(app)
                .post('/api/v1/products')
                .set({ Authorization: `Bearer ${tokenClient}` })
                .send(product);

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('You are not allowed to access this resource');
        });

        it('It should not create a product not logged it', async () => {
            const product = {
                name: faker.commerce.productName(),
                price: Number(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                stock: faker.datatype.number(100),
                category: faker.commerce.department(),
            };

            const res = await request(app).post('/api/v1/products').send(product);
            expect(res.status).toBe(401);
            expect(res.text).toEqual('Unauthorized');
        });

        it('It should not create a product with not valid data', async () => {
            const product = {
                name: faker.commerce.productName(),
                price: Number(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                stock: faker.datatype.number(100),
            };

            const res = await request(app)
                .post('/api/v1/products')
                .set({
                    Authorization: `Bearer ${tokenAdmin}`,
                })
                .send(product);
            expect(res.status).toBe(422);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('api/v1/products (index) [get]', () => {
        it('It should get all products', async () => {
            const res = await request(app).get('/api/v1/products');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('products');
            expect(res.body.products.length).toBeGreaterThan(0);
        });

        it('It should get all products with pagination', async () => {
            const res = await request(app).get('/api/v1/products?page=1&limit=10');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('products');
            expect(res.body.products.length).toBeGreaterThan(0);
        });

        it('It should get not products if page does not have products', async () => {
            const res = await request(app).get('/api/v1/products?page=4&limit=10');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('products');
            expect(res.body.products).toHaveLength(0);
        });

        it('It should get all products with search', async () => {
            const product = {
                name: faker.commerce.productName(),
                price: Number(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                stock: faker.datatype.number(100),
                category: 'test',
            };

            await request(app)
                .post('/api/v1/products')
                .set({ Authorization: `Bearer ${tokenAdmin}` })
                .send(product);

            const res = await request(app).get('/api/v1/products?q=test');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('products');
            expect(res.body.products).toHaveLength(1);
        });
    });

    describe('api/v1/products/:id (show) [get]', () => {
        it('It should get a product', async () => {
            const product = await productFactory.make();

            const res = await request(app).get(`/api/v1/products/${product.id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('product');
            expect(res.body.product).toHaveProperty('id');
            expect(res.body.product).toHaveProperty('name');
        });

        it('It should not get a product if not exists', async () => {
            const res = await request(app).get('/api/v1/products/999999');
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Product not found');
        });
    });

    describe('api/v1/products/:id (update) [put]', () => {
        it('It should update a product as admin', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .put(`/api/v1/products/${product.id}`)
                .set({ Authorization: `Bearer ${tokenAdmin}` })
                .send({
                    name: 'updated',
                    description: faker.commerce.productDescription(),
                    price: Number(faker.commerce.price()),
                    stock: faker.datatype.number(100),
                    category: faker.commerce.department(),
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('product');
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Product updated');
            expect(res.body.product).toHaveProperty('id');
            expect(res.body.product).toHaveProperty('name');
            expect(res.body.product.name).toEqual('updated');
        });

        it('It should not update a product as client', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .put(`/api/v1/products/${product.id}`)
                .set({ Authorization: `Bearer ${tokenClient}` })
                .send({
                    name: 'updated',
                    description: faker.commerce.productDescription(),
                    price: Number(faker.commerce.price()),
                    stock: faker.datatype.number(100),
                    category: faker.commerce.department(),
                });

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('message');
        });

        it('It should not update a product if not exists', async () => {
            const res = await request(app)
                .put('/api/v1/products/999999')
                .set({ Authorization: `Bearer ${tokenAdmin}` })
                .send({
                    name: 'updated',
                    description: faker.commerce.productDescription(),
                    price: Number(faker.commerce.price()),
                    stock: faker.datatype.number(100),
                    category: faker.commerce.department(),
                });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Product not found');
        });

        it('It should not update a product with not valid data', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .put(`/api/v1/products/${product.id}`)
                .set({ Authorization: `Bearer ${tokenAdmin}` })
                .send({
                    name: 'updated',
                    description: faker.commerce.productDescription(),
                    price: 'not valid',
                    stock: faker.datatype.number(100),
                    category: faker.commerce.department(),
                });

            expect(res.status).toBe(422);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('api/v1/products/:id [delete]', () => {
        it('It should delete a product as admin', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .delete(`/api/v1/products/${product.id}`)
                .set({ Authorization: `Bearer ${tokenAdmin}` });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Product deleted');
        });

        it('It should not delete a product as client', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .delete(`/api/v1/products/${product.id}`)
                .set({ Authorization: `Bearer ${tokenClient}` });

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('message');
        });

        it('It should not delete a product if not exists', async () => {
            const res = await request(app)
                .delete('/api/v1/products/999999')
                .set({ Authorization: `Bearer ${tokenAdmin}` });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Product not found');
        });
    });

    describe('api/v1/products/:id/disable [put]', () => {
        it('It should delete a product as admin', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .put(`/api/v1/products/${product.id}/disable`)
                .set({ Authorization: `Bearer ${tokenAdmin}` });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Product disabled');
        });

        it('It should not delete a product as client', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .put(`/api/v1/products/${product.id}/disable`)
                .set({ Authorization: `Bearer ${tokenClient}` });

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('message');
        });

        it('It should not delete a product if not exists', async () => {
            const res = await request(app)
                .put('/api/v1/products/999999/disable')
                .set({ Authorization: `Bearer ${tokenAdmin}` });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Product not found');
        });
    });

    describe('api/v1/products/:id/image [put]', () => {
        it('It should upload a product image as admin', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .put(`/api/v1/products/${product.id}/image`)
                .set({ Authorization: `Bearer ${tokenAdmin}` })
                .send({
                    url: 'https://picsum.photos/200/300',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Image uploaded');
        });

        it('It should not upload a product image as client', async () => {
            const product = await productFactory.make();

            const res = await request(app)
                .put(`/api/v1/products/${product.id}/image`)
                .set({ Authorization: `Bearer ${tokenClient}` })
                .send({
                    url: 'https://picsum.photos/200/300',
                });

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('You are not allowed to access this resource');
        });

        it('It should not upload a product image if not exists', async () => {
            const res = await request(app)
                .put('/api/v1/products/999999/image')
                .set({ Authorization: `Bearer ${tokenAdmin}` })
                .send({
                    url: 'https://picsum.photos/200/300',
                });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Product not found');
        });
    });
});
