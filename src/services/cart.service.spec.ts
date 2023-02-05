import { prisma } from '../database/prisma';
import { ProductFactory } from '../factories/product.factory';
import { UserFactory } from '../factories/user.factory';
import { CartService } from './cart.service';

describe('CartService', () => {
    let userFactory: UserFactory;
    let productFactory: ProductFactory;

    beforeAll(() => {
        userFactory = new UserFactory(prisma);
        productFactory = new ProductFactory(prisma);
    });

    describe('addToCart', () => {
        it('should be able to add a product to cart', async () => {
            const user = await userFactory.make();
            const product = await productFactory.make();

            const result = await CartService.addToCart(user.id as number, product.id as number);

            expect(result).toEqual(true);
        });

        it('should be able to add a product to cart with quantity', async () => {
            const user = await userFactory.make();
            const product = await productFactory.make();

            const result = await CartService.addToCart(user.id as number, product.id as number, 1);

            expect(result).toEqual(true);
        });

        it('should be able to not add a product to cart with quantity greater than stock', async () => {
            const user = await userFactory.make();
            const product = await productFactory.make();

            await expect(CartService.addToCart(user.id as number, product.id as number, 999999999)).rejects.toThrow(
                new Error('Not enough stock'),
            );
        });

        it('should be able to not add a product to cart that does not exist', async () => {
            const user = await userFactory.make();

            await expect(CartService.addToCart(user.id as number, 999999999)).rejects.toThrow(
                new Error('Product not found'),
            );
        });
    });
});
