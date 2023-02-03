import { prisma } from '../database/prisma';
import { User } from '../interfaces/auth/user';

export class AuthService {
    static async singUp(user: User) {
        const userCreated = await prisma.user.create({
            data: {
                email: user.email,
                password: user.password,
                name: user.name,
                role: {
                    connect: {
                        name: 'client',
                    },
                },
            },
        });

        return userCreated;
    }

    static async logIn() {
        const token = await prisma.user.findUnique({
            where: {
                email: 'user@test.com',
            },
        });

        return token;
    }
}
