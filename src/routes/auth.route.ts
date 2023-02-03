import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/schemaValidator';
import { loginSchema } from '../schemas/auth/login.schema';
import { signupSchema } from '../schemas/auth/signup.schema';

export function authRoutes(): Router {
    const router = Router();

    router.post('/login', validate({ body: loginSchema }), AuthController.logIn);
    router.post('/signup', validate({ body: signupSchema }), AuthController.singUp);
    // router.post('/logout', authController.logOut);

    return router;
}
