import { Router } from 'express';
import { authRoutes } from './auth.route';
import { productRoutes } from './product.route';
import { feedRoutes } from './feed.route';

export function indexRoutes(app: Router): Router {
    const router = Router();
    app.use('/api/v1', authRoutes());
    app.use('/api/v1/products', productRoutes());
    app.use('/api/v1/feed', feedRoutes());
    return router;
}
