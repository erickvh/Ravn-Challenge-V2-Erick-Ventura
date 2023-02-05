import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.join(__dirname, '../../.env'),
});

export default {
    jwtSecret: process.env.JWT_SECRET || 'somesecrettoken',
    email: {
        host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.EMAIL_PORT || 2525,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
};
