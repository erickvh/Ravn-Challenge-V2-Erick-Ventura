import express from 'express';
import { hello } from './controllers/main';
import { config } from 'dotenv';
const app = express();

config();

app.get('/', hello);

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});
