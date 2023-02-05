import { prisma } from '../database/prisma';
import { selectCarts, selectOrders } from './utils/selects';
import { NotFound } from 'http-errors';
import { CartItems } from '../interfaces/order/cart.types';
import { Order, Cart, Product } from '@prisma/client';
import { buildReponseOrder } from './utils/buildResponses';
import { addEmailToQueue } from '../jobs/queues/email.queue';

export class OrderService {
    static async getDraftCart(userId: number) {
        const cart = await prisma.cart.findFirst({
            where: {
                userId: userId,
                isDraft: true,
            },
            ...selectCarts,
        });

        if (!cart) throw new NotFound('Cart not found');

        return cart;
    }

    static validateStockProducts(cartItems: CartItems[]) {
        cartItems.forEach((item) => {
            if (item.quantity > item.Product.stock) {
                throw new NotFound(`Product ${item.Product.name} is out of stock`);
            }
        });
    }

    static async createOrderHeader(userId: number, address: string) {
        const order = await prisma.order.create({
            data: {
                userId: userId,
                address: address,
            },
        });

        return order;
    }

    static async createOrderItems(order: Order, cartItems: CartItems[]) {
        //  it will handle creation of order items
        const orderItems = await prisma.orderItem.createMany({
            data: cartItems.map((item) => ({
                orderId: order.id,
                productId: item.Product.id,
                quantity: item.quantity,
                price: item.Product.price,
            })),
        });

        return orderItems;
    }

    static async outOfStockNotifier(product: Product): Promise<void> {
        if (product.stock > 3 || product.stock === 0) return;

        const userLike = await prisma.like.findFirst({
            where: {
                productId: product.id,
            },
            include: {
                User: true,
                Product: {
                    include: {
                        Images: true,
                    },
                },
            },
        });

        if (userLike) {
            const { User, Product } = userLike;
            const email = User.email;
            const image = Product.Images[0].url;

            const subject = 'A product you like is almost out of stock 👀';

            const message = `
                <h3>Hi ${User.name},</h3>
                <p>Product <strong>${Product.name}</strong> is almost out of stock.
                    You can buy it now before it's too late.
                </p>
                <p>Only ${product.stock} left.</p>
                <p>
                    <img src="${image}" alt="${Product.name}" style="width: 100px; height: 100px; object-fit: cover;"/>
                </p>

                `;

            addEmailToQueue(email, subject, message);
        }
    }

    static async updateStockProducts(cartItems: CartItems[]) {
        for (const item of cartItems) {
            const productUpdated = await prisma.product.update({
                where: {
                    id: item.Product.id,
                },
                data: {
                    stock: item.Product.stock - item.quantity,
                },
            });

            await this.outOfStockNotifier(productUpdated);
        }
    }

    static async undraftCart(cartId: number) {
        await prisma.cart.update({
            where: {
                id: cartId,
            },
            data: {
                isDraft: false,
            },
        });
    }

    static getOrderById = async (orderId: number) => {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            },
            ...selectOrders,
        });

        if (!order) throw new NotFound('Order not found');

        return order;
    };

    static async checkoutOrder(userId: number, address: string) {
        const cart = await this.getDraftCart(userId);

        await this.validateStockProducts(cart.CartItems as CartItems[]);
        const orderHeader = await this.createOrderHeader(userId, address);
        await this.createOrderItems(orderHeader, cart.CartItems as CartItems[]);
        await this.updateStockProducts(cart.CartItems as CartItems[]);
        const orderCreated = await this.getOrderById(orderHeader.id);
        await this.undraftCart(cart.id as number);
        return buildReponseOrder(orderCreated);
    }

    static async getMyOrders(userId: number) {
        const orders = await prisma.order.findMany({
            where: {
                userId: userId,
            },
            ...selectOrders,
        });

        return orders.map((order) => buildReponseOrder(order));
    }

    static async getOrdersByUserId(userId: string) {
        const orders = await prisma.order.findMany({
            where: {
                userId: parseInt(userId),
            },
            ...selectOrders,
        });
        return orders.map((order) => buildReponseOrder(order));
    }
}
