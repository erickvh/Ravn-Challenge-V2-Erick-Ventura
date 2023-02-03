import { PrismaClient } from '@prisma/client';

export async function roleSeed(prisma: PrismaClient) {
    const roles = ['client', 'admin'];

    return roles.map(async (role) => {
        await prisma.role.upsert({
            create: {
                name: role,
            },
            update: {},
            where: {
                name: role,
            },
        });
    });
}
