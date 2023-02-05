import { prisma } from '../database/prisma';
import { ProductFactory } from '../factories/product.factory';
import { UserFactory } from '../factories/user.factory';
import { OrderService } from './order.service';
import { CartService } from './cart.service';
import { Cart } from '@prisma/client';

describe('OrderService', () => {
    let userFactory: UserFactory;
    let productFactory: ProductFactory;

    beforeAll(() => {
        userFactory = new UserFactory(prisma);
        productFactory = new ProductFactory(prisma);
    });

    describe('Checkout', () => {
        it('should be able to checkout an order', async () => {
            const user = await userFactory.make();
            const product = await productFactory.make();

            await CartService.addToCart(user.id as number, product.id as number, 1);

            const result = await OrderService.checkoutOrder(user.id as number, 'address');

            expect(result).toBeDefined();
            expect(result).toHaveProperty('orderId');
            expect(result).toHaveProperty('status');
            expect(result.status).toEqual('processed');
            expect(result.items.length).toBeGreaterThan(0);
        });

        it('should be able to checkout an order with multiple products', async () => {
            const user = await userFactory.make();
            const product = await productFactory.make();
            const product2 = await productFactory.make();

            await CartService.addToCart(user.id as number, product.id as number, 1);
            await CartService.addToCart(user.id as number, product2.id as number, 1);

            const result = await OrderService.checkoutOrder(user.id as number, 'address');

            expect(result).toBeDefined();
            expect(result).toHaveProperty('orderId');
            expect(result).toHaveProperty('status');
            expect(result.status).toEqual('processed');
            expect(result.items.length).toEqual(2);
        });

        it("should be not able to checkout an order if the user doesn't have a cart", async () => {
            const user = await userFactory.make();

            await expect(OrderService.checkoutOrder(user.id as number, 'address')).rejects.toThrow(
                new Error('Cart not found'),
            );
        });

        it("should be not able to checkout an order if a product doesn't have stock", async () => {
            const user = await userFactory.make();
            const product = await productFactory.makeUsingData({
                stock: 10,
                category: 'test',
                description: 'test',
                name: 'test',
                price: 10,
            });

            await CartService.addToCart(user.id as number, product.id as number, 9);

            // Update the product stock to 4
            await prisma.product.update({
                where: {
                    id: product.id,
                },
                data: {
                    stock: 4,
                },
            });

            await expect(OrderService.checkoutOrder(user.id as number, 'address')).rejects.toThrow(
                new Error('Product test is out of stock'),
            );
        });
    });

    describe('MyOrders', () => {
        it('it should return all orders of a user', async () => {
            const user = await userFactory.make();
            const product = await productFactory.make();

            await CartService.addToCart(user.id as number, product.id as number, 1);

            await OrderService.checkoutOrder(user.id as number, 'address');

            const result = await OrderService.getMyOrders(user.id as number);

            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
        });

        it('it should return an empty array if the user has no orders', async () => {
            const user = await userFactory.make();

            const result = await OrderService.getMyOrders(user.id as number);

            expect(result).toBeDefined();
            expect(result.length).toEqual(0);
        });
    });

    describe('GetOrderByUserId', () => {
        it('it should return a list with order for the user', async () => {
            const user = await userFactory.make();
            const product = await productFactory.make();

            await CartService.addToCart(user.id as number, product.id as number, 1);

            const order = await OrderService.checkoutOrder(user.id as number, 'address');
            const result = await OrderService.getOrdersByUserId(user.id.toString());

            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].orderId).toEqual(order.orderId);
        });

        it('it should return an empty array if the user has no orders', async () => {
            const user = await userFactory.make();

            const result = await OrderService.getOrdersByUserId(user.id.toString());

            expect(result).toBeDefined();
            expect(result.length).toEqual(0);
        });

        it('it should return an empty array if the user id is not valid', async () => {
            const result = await OrderService.getOrdersByUserId('0');

            expect(result).toBeDefined();
            expect(result.length).toEqual(0);
        });
    });
});
