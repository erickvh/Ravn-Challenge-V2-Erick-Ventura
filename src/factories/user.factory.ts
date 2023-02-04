import { PrismaClient, User } from '@prisma/client';
import { IUserRequest } from '../interfaces/auth/user';
import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';

export class UserFactory {
    protected readonly prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    async make(type: string = 'client'): Promise<User> {
        let user: User;
        try {
            user = await this.prismaClient.user.create({
                data: {
                    name: faker.name.fullName(),
                    email: faker.internet.email(),
                    password: await hash('secret123', 10),
                    role: {
                        connect: {
                            name: type,
                        },
                    },
                },
            });
        } catch (err) {
            user = await this.make(type);
        }
        return user;
    }

    async makeUsingData(data: IUserRequest): Promise<User> {
        let user: User;
        try {
            user = await this.prismaClient.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: await hash(data.password, 10),
                    role: {
                        connect: {
                            name: 'client',
                        },
                    },
                },
            });
        } catch (err) {
            user = await this.makeUsingData(data);
        }

        return user;
    }
}
