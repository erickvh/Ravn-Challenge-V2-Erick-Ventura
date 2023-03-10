import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import config from '../config/config';
import { prisma } from '../database/prisma';
import { IUserRequest } from '../interfaces/auth/user';
import { Request } from 'express';
import { getRedisClient } from '../database/redis';

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true,
    secretOrKey: config.jwtSecret,
};

export const verifyToken = new Strategy(opts, async (req: Request, payload: IUserRequest, done: VerifiedCallback) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
    });

    if (!user) return done(null, false);

    const redisClient = await getRedisClient();
    const TokenExistsOnBlackList = await redisClient.get(`bl_${req.headers.authorization}`);

    if (TokenExistsOnBlackList) return done(null, false);

    return done(null, user);
});
