import { Router } from 'express';
import { authRoutes } from './auth.route';

export function indexRoutes(app: Router): Router {
    const router = Router();
    app.use('/api/v1', authRoutes());
    return router;
}
