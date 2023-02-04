import { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcryptjs';

export async function userSeed(prisma: PrismaClient): Promise<User[]> {
    console.log('running seeders for users 🌱');
    const adminPassword = await hash('admin', 10);
    const clientPassword = await hash('secret123', 10);

    const users = [
        {
            email: 'admin@bookify.com',
            password: adminPassword,
            name: 'Jane doe',
            role: 'manager',
        },
        {
            email: 'manager@bookify.com',
            password: adminPassword,
            name: 'Jonh Doe',
            role: 'manager',
        },
        {
            email: 'customer.bar@test.com',
            password: clientPassword,
            name: 'Customer Bar',
            role: 'client',
        },
        {
            email: 'customer.foo@test.com',
            password: clientPassword,
            name: 'Customer Foo',
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
