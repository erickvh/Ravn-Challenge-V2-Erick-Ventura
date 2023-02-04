import { Router } from 'express';
import passport from 'passport';
import { validateClient } from '../middlewares/guards/client.guard';
import { validate } from '../middlewares/schemaValidator';
import { OrderController } from '../controllers/order.controller';
import { orderSchema } from '../schemas/order/order.schema';

export function checkoutOrderRoutes(): Router {
    const router = Router();
    router.post(
        '/checkout',
        passport.authenticate('jwt', { session: false }),
        validateClient,
        validate({ body: orderSchema }),
        OrderController.checkoutOrder,
    );

    return router;
}
