import { Router } from 'express';
import { authRoutes } from './auth.route';
import { productRoutes } from './product.route';

export function indexRoutes(app: Router): Router {
    const router = Router();
    app.use('/api/v1', authRoutes());
    app.use('/api/v1/products', productRoutes());
    return router;
}
