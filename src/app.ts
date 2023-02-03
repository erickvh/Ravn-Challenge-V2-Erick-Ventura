import { indexRoutes } from './routes/index.route';
import { errorHandler } from './middlewares/errorHandler';
import passport from 'passport';
import { verifyToken } from './middlewares/verifyToken';
import express, { Application } from 'express';
import 'express-async-errors';

export const appBuilder = (): Application => {
    const app = express();
    app.use(express.json());
    app.use(indexRoutes(app));
    passport.use(verifyToken);
    app.use(passport.initialize());
    app.use(errorHandler);

    return app;
};
