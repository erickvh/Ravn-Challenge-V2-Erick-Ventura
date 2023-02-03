import { PrismaClient, User } from '@prisma/client';
import { IUserRequest } from '../interfaces/auth/user';
import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';

export class UserFactory {
    protected readonly prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    async make(): Promise<User> {
        const user = await this.prismaClient.user.create({
            data: {
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: await hash('secret123', 10),
                role: {
                    connect: {
                        name: ['manager', 'client'][Math.floor(Math.random() * 2)],
                    },
                },
            },
        });
        return user;
    }

    async makeUsingData(data: IUserRequest): Promise<User> {
        const user = await this.prismaClient.user.create({
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

        return user;
    }

    async makeMany(qty: number): Promise<User[]> {
        return Promise.all([...Array(qty)].map(async () => await this.make()));
    }
}
