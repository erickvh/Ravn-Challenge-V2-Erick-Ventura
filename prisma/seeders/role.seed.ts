import { PrismaClient, Role } from '@prisma/client';

export async function roleSeed(prisma: PrismaClient): Promise<Role[]> {
    const roles = ['client', 'manager'];

    return Promise.all(
        roles.map((role) => {
            return prisma.role.upsert({
                create: {
                    name: role,
                },
                update: {
                    name: role,
                },
                where: {
                    name: role,
                },
            });
        }),
    );
}
