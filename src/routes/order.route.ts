import { Router } from 'express';
import passport from 'passport';
import { validateClient } from '../middlewares/guards/client.guard';
import { validate } from '../middlewares/schemaValidator';
import { OrderController } from '../controllers/order.controller';
import { orderSchema } from '../schemas/order/order.schema';
import { validateAdmin } from '../middlewares/guards/admin.guard';
import { paramIdInt } from '../middlewares/paramIdInt';

export function checkoutOrderRoutes(): Router {
    const router = Router();
    router.post(
        '/checkout',
        passport.authenticate('jwt', { session: false }),
        validateClient,
        validate({ body: orderSchema }),
        OrderController.checkoutOrder,
    );

    router.get(
        '/my-orders',
        passport.authenticate('jwt', { session: false }),
        validateClient,
        OrderController.getMyOrders,
    );

    router.get(
        '/users/:id',
        passport.authenticate('jwt', { session: false }),
        validateAdmin,
        paramIdInt,
        OrderController.getOrdersByUserId,
    );

    return router;
}
