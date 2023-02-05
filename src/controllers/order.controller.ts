import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { IUserResponse } from '../interfaces/auth/user';

export class OrderController {
    static async checkoutOrder(req: Request, res: Response) {
        const user = req.user as IUserResponse;
        const { address } = req.body;

        const order = await OrderService.checkoutOrder(user.id as number, address);

        return res.json({
            message: 'Order placed successfully',
            order: order,
        });
    }

    static async getMyOrders(req: Request, res: Response) {
        const user = req.user as IUserResponse;

        const orders = await OrderService.getMyOrders(user.id as number);

        return res.json({
            orders: orders,
        });
    }

    static async getOrdersByUserId(req: Request, res: Response) {
        const { id } = req.params;

        const orders = await OrderService.getOrdersByUserId(id);

        return res.json({
            orders: orders,
        });
    }
}
