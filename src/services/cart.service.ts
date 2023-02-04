import { prisma } from '../database/prisma';
import { NotFound, BadRequest } from 'http-errors';
export class CartService {
    static async validateProduct(productId: number, qty: number): Promise<void> {
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                is_active: true,
            },
        });

        if (!product) {
            throw new NotFound('Product not found');
        }

        if (product.stock < qty) {
            throw new BadRequest('Not enough stock');
        }
    }

    static async addToCart(userId: number, productId: number, qty: number = 1): Promise<void> {
        await this.validateProduct(productId, qty);
        // Find the cart for the user
        let cart = await prisma.cart.findFirst({
            where: {
                userId: userId,
                isDraft: true,
            },
        });

        // If the user doesn't have a cart, create one
        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: userId,
                    isDraft: true,
                },
            });
        }

        // Upsert the cart item
        await prisma.cartItems.upsert({
            create: {
                cartId: cart.id,
                productId: productId,
                quantity: qty,
            },
            update: {
                quantity: qty,
            },
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId,
                },
            },
        });
    }
}
