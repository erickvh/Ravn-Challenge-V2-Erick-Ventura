import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';

export class CartController {
    static async addToCart(req: Request, res: Response) {
        const cart = await CartService.addToCart();

        return res.status(200).json('sth');
    }
}
