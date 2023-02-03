import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async singUp(req: Request, res: Response) {
        const token = await AuthService.singUp(req.body);
        res.status(200).json({ token });
    }

    static async logIn(req: Request, res: Response) {
        const token = await AuthService.logIn();
        res.status(200).json({ token });
    }
}
