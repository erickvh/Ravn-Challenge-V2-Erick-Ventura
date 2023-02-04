import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { IUserResponse } from '../interfaces/auth/user';

export class CartController {
    static async addToCart(req: Request, res: Response) {
        const user = req.user as IUserResponse;
        const { productId, qty } = req.body;

        await CartService.addToCart(user.id as number, productId, qty);

        return res.status(201).json({
            message: 'Product added to cart',
        });
    }
}
