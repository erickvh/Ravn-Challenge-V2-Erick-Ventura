import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/schemaValidator';
import { loginSchema } from '../schemas/auth/login.schema';
import { signupSchema } from '../schemas/auth/signup.schema';
import passport from 'passport';

export function authRoutes(): Router {
    const router = Router();

    router.post('/login', validate({ body: loginSchema }), AuthController.logIn);
    router.post('/signup', validate({ body: signupSchema }), AuthController.singUp);
    router.post('/logout', passport.authenticate('jwt', { session: false }), AuthController.logOut);

    return router;
}
