import { PrismaClient } from '@prisma/client';

export async function userSeed(prisma: PrismaClient) {
    const users = [
        {
            email: 'admin@booky.com',
            password: 'admin',
            name: 'Jane doe',
            role: 'admin',
        },
        {
            email: 'manager@booky.com',
            password: 'admin',
            name: 'Jonh Doe',
            role: 'admin',
        },
        {
            email: 'customer@test.com',
            password: 'secret123',
            name: 'Erick Ventura',
            role: 'client',
        },
        {
            email: 'customer2@test.com',
            password: 'secret123',
            name: 'Antonio Hurtado',
            role: 'client',
        },
    ];

    return users.map(async (user) => {
        await prisma.user.upsert({
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
            update: {},
            where: {
                email: user.email,
            },
        });
    });
}
