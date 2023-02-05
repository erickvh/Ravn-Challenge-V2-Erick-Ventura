import Bull from 'bull';
import config from '../config/config';

const bull = new Bull('Jobs', {
    redis: {
        host: config.redis.host,
        port: Number(config.redis.port) || 6379,
    },
});

bull.on('completed', () => {
    console.log(`Job completed`);
});

bull.on('failed', () => {
    console.log(`Job failed`);
});

export { bull };
