import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendEmail } from '../services/utils/mailer';

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

    static async forgotPassword(req: Request, res: Response) {
        const resetToken = await AuthService.forgotPassword(req.body);
        res.status(200).json({ resetToken });
    }

    static async resetPassword(req: Request, res: Response) {
        const userFound = await AuthService.resetPassword(req.params.resetToken, req.body);
        sendEmail(
            userFound.email,
            'Password reset',
            `Hi ${userFound.name}, Your password has been reset, login with your new password`,
        );
        res.status(200).json({ message: 'Password has been reset', user: userFound });
    }
}
