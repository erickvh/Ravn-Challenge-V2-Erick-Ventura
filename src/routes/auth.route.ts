import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/schemaValidator';
import { loginSchema } from '../schemas/auth/login.schema';
import { signupSchema } from '../schemas/auth/signup.schema';
import passport from 'passport';
import { forgotSchema } from '../schemas/auth/forgot.schema';
import { resetSchema } from '../schemas/auth/reset.schema';

export function authRoutes(): Router {
    const router = Router();

    router.post('/login', validate({ body: loginSchema }), AuthController.logIn);
    router.post('/signup', validate({ body: signupSchema }), AuthController.singUp);
    router.post('/logout', passport.authenticate('jwt', { session: false }), AuthController.logOut);
    router.post('/forgotPassword', validate({ body: forgotSchema }), AuthController.forgotPassword);
    router.post('/resetPassword/:resetToken', validate({ body: resetSchema }), AuthController.resetPassword);
    return router;
}
