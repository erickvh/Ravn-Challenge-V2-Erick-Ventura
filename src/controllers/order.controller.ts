import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { IUserResponse } from '../interfaces/auth/user';

export class OrderController {
    static async checkoutOrder(req: Request, res: Response) {
        const user = req.user as IUserResponse;
        const { address } = req.body;

        const cart = await OrderService.checkoutOrder(user.id as number, address);

        return res.json(cart);
    }
}
