import { Request, Response } from 'express';
import { feedService } from '../services/feed.service';
import { IUserResponse } from '../interfaces/auth/user';

export class FeedController {
    static async like(req: Request, res: Response) {
        const user = req.user as IUserResponse;

        await feedService.like(user.id as number, req.body.productId);

        res.status(200).json({ message: 'Product liked' });
    }
}
