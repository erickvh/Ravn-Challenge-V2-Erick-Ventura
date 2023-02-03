import { prisma } from '../database/prisma';
import { IUserRequest, IUserResponse } from '../interfaces/auth/user';
import { compare, hash } from 'bcryptjs';
import { UnprocessableEntity, Unauthorized } from 'http-errors';
import config from '../config/config';
import { sign } from 'jsonwebtoken';
import { getRedisClient } from '../database/redis';
export class AuthService {
    static async singUp(user: IUserRequest): Promise<IUserResponse> {
        try {
            const userCreated = await prisma.user.create({
                data: {
                    email: user.email,
                    password: await hash(user.password, 10),
                    name: user.name,
                    role: {
                        connect: {
                            name: 'client',
                        },
                    },
                },
                select: {
                    email: true,
                    name: true,
                    role: true,
                },
            });
            return userCreated;
        } catch (err) {
            throw UnprocessableEntity('User already exists');
        }
    }

    static async logIn(user: IUserRequest) {
        const userFound = await prisma.user.findUnique({
            where: {
                email: user.email,
            },
            select: {
                name: true,
                email: true,
                password: true,
            },
        });

        if (!userFound) throw new Unauthorized('User not found');

        const isPasswordValid = await compare(user.password, userFound.password);

        if (!isPasswordValid) throw new Unauthorized('Invalid password');

        return this.createToken(userFound);
    }

    static async createToken(user: IUserRequest) {
        const token = sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            config.jwtSecret,
            {
                expiresIn: '1d',
            },
        );
        return token;
    }

    static async logOut(token: string | undefined) {
        if (!token) throw new Unauthorized('Token not found');
        const clientRedis = await getRedisClient();
        const tokenKey = `bl_${token}`;
        await clientRedis.set(tokenKey, token);
    }
}
