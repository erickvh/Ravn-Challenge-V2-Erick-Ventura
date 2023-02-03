import 'express-async-errors';

import { config } from 'dotenv';
import { appBuilder } from './app';

config();

const app = appBuilder();

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});
