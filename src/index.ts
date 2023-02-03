import 'express-async-errors';
import express from 'express';
import { config } from 'dotenv';
import { indexRoutes } from './routes/index.route';
import { errorHandler } from './middlewares/errorHandler';

config();

const app = express();
app.use(express.json());
app.use(indexRoutes(app));
app.use(errorHandler);
app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});
