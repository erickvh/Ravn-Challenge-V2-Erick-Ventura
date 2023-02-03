import 'express-async-errors';
import express from 'express';
import { config } from 'dotenv';
import { indexRoutes } from './routes/index.route';
import { errorHandler } from './middlewares/errorHandler';
import passport from 'passport';
import { verifyToken } from './middlewares/verifyToken';

config();

const app = express();
app.use(express.json());
app.use(indexRoutes(app));
app.use(errorHandler);

app.use(passport.initialize());
passport.use(verifyToken);

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});
