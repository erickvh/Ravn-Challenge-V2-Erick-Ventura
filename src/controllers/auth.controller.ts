import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async singUp(req: Request, res: Response) {
        const user = await AuthService.singUp(req.body);

        res.status(200).json({ user });
    }

    static async logIn(req: Request, res: Response) {
        const token = await AuthService.logIn(req.body);
        res.status(200).json({ token });
    }

    static async logOut(req: Request, res: Response) {
        if (await AuthService.logOut(req.headers.authorization))
            res.status(200).json({ message: 'User has been logged out' });
    }
}
