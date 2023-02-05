import { Router } from 'express';
import passport from 'passport';
import { FeedController } from '../controllers/feed.controller';
import { validateClient } from '../middlewares/guards/client.guard';
import { validate } from '../middlewares/schemaValidator';
import { likeSchema } from '../schemas/feed/feed.schema';

export function feedRoutes(): Router {
    const router = Router();
    router.post(
        '/like',
        passport.authenticate('jwt', { session: false }),
        validateClient,
        validate({ body: likeSchema }),
        FeedController.like,
    );

    return router;
}
