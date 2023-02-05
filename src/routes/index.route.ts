import { Router } from 'express';
import { authRoutes } from './auth.route';
import { productRoutes } from './product.route';
import { feedRoutes } from './feed.route';
import { cartRoutes } from './cart.route';
import { checkoutOrderRoutes } from './order.route';

export function indexRoutes(app: Router): Router {
    const router = Router();
    app.use('/api/v1', authRoutes());
    app.use('/api/v1/products', productRoutes());
    app.use('/api/v1/feed', feedRoutes());
    app.use('/api/v1/cart', cartRoutes());
    app.use('/api/v1/orders', checkoutOrderRoutes());
    return router;
}
