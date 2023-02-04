import { prisma } from '../database/prisma';
import { ILike } from '../interfaces/feed/like';
import { UnprocessableEntity } from 'http-errors';

export class feedService {
    static async like(userId: number, productId: number): Promise<ILike> {
        const productFound = await prisma.product.findFirst({
            where: {
                id: productId,
                is_active: true,
            },
        });

        if (!productFound) throw UnprocessableEntity('Product not found');

        try {
            const likeCreated = await prisma.like.create({
                data: {
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                    Product: {
                        connect: {
                            id: productId,
                        },
                    },
                },
            });
            return likeCreated;
        } catch (err) {
            throw UnprocessableEntity('You already liked this product');
        }
    }
}
