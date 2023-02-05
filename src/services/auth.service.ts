import { prisma } from '../database/prisma';
import { IUserRequest, IUserResponse } from '../interfaces/auth/user';
import { compare, hash } from 'bcryptjs';
import { UnprocessableEntity, Unauthorized } from 'http-errors';
import config from '../config/config';
import { sign } from 'jsonwebtoken';
import { getRedisClient } from '../database/redis';
import crypto from 'crypto';
import { User } from '.prisma/client';
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

    static async logIn(user: IUserRequest): Promise<string> {
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

        if (!isPasswordValid) throw Unauthorized('Invalid password');

        return this.createToken(userFound);
    }

    static async createToken(user: IUserRequest): Promise<string> {
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

    static async logOut(token: string | undefined): Promise<boolean> {
        if (!token) throw Unauthorized('Token not found');
        const clientRedis = await getRedisClient();
        const tokenKey = `bl_${token}`;
        await clientRedis.set(tokenKey, token);

        return true;
    }

    static async forgotPassword(user: IUserRequest): Promise<string> {
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

        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        await prisma.user.update({
            where: {
                email: user.email,
            },
            data: {
                passwordResetToken,
            },
        });

        return passwordResetToken;
    }

    static async resetPassword(resetToken: string, user: IUserRequest): Promise<User> {
        const userFound = await prisma.user.findFirst({
            where: {
                passwordResetToken: resetToken,
            },
            select: {
                name: true,
                email: true,
            },
        });

        if (!userFound) throw new Unauthorized('Token not found');

        const password = await hash(user.password, 10);

        await prisma.user.update({
            where: {
                email: userFound.email,
            },
            data: {
                password: password,
                passwordResetToken: null,
            },
        });

        return userFound as User;
    }
}
