import { prisma } from '../database/prisma';
import { ProductFactory } from '../factories/product.factory';
import { UserFactory } from '../factories/user.factory';
import { feedService } from './feed.service';

describe('FeedService', () => {
    let userFactory: UserFactory;
    let productFactory: ProductFactory;

    beforeAll(() => {
        userFactory = new UserFactory(prisma);
        productFactory = new ProductFactory(prisma);
    });

    describe('like', () => {
        it('should be able to like a product', async () => {
            const user = await userFactory.make();
            const product = await productFactory.make();

            const result = await feedService.like(user.id as number, product.id as number);
            expect(result).toHaveProperty('id');
            expect(result.productId).toEqual(product.id);
        });

        it('should be able to not like a product already liked it', async () => {
            const user = await userFactory.make();
            const product = await productFactory.make();

            const result = await feedService.like(user.id as number, product.id as number);

            expect(result).toHaveProperty('id');
            expect(result.productId).toEqual(product.id);

            await expect(feedService.like(user.id as number, product.id as number)).rejects.toThrow(
                new Error('You already liked this product'),
            );
        });

        it('should be able to not like a product that does not exist', async () => {
            const user = await userFactory.make();

            await expect(feedService.like(user.id as number, 999999999)).rejects.toThrow(
                new Error('Product not found'),
            );
        });
    });
});
