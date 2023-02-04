import { Router } from 'express';
import passport from 'passport';
import { CartController } from '../controllers/cart.controller';
import { validateClient } from '../middlewares/guards/client.guard';
import { validate } from '../middlewares/schemaValidator';
import { likeSchema } from '../schemas/feed/feed.schema';

export function cartRoutes(): Router {
    const router = Router();
    router.post(
        '/addToCart',
        passport.authenticate('jwt', { session: false }),
        validateClient,
        validate({ body: likeSchema }),
        CartController.addToCart,
    );

    return router;
}
