import { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcryptjs';

export async function userSeed(prisma: PrismaClient): Promise<User[]> {
    const adminPassword = await hash('admin', 10);
    const clientPassword = await hash('secret123', 10);

    const users = [
        {
            email: 'admin@booky.com',
            password: adminPassword,
            name: 'Jane doe',
            role: 'manager',
        },
        {
            email: 'manager@booky.com',
            password: adminPassword,
            name: 'Jonh Doe',
            role: 'manager',
        },
        {
            email: 'customer@test.com',
            password: clientPassword,
            name: 'Erick Ventura',
            role: 'client',
        },
        {
            email: 'customer2@test.com',
            password: clientPassword,
            name: 'Antonio Hurtado',
            role: 'client',
        },
    ];

    return Promise.all(
        users.map((user) => {
            return prisma.user.upsert({
                create: {
                    email: user.email,
                    password: user.password,
                    name: user.name,
                    role: {
                        connect: {
                            name: user.role,
                        },
                    },
                },
                update: {
                    email: user.email,
                    password: user.password,
                    name: user.name,
                    role: {
                        connect: {
                            name: user.role,
                        },
                    },
                },
                where: {
                    email: user.email,
                },
            });
        }),
    );
}
