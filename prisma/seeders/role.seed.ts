import { PrismaClient, Role } from '@prisma/client';

export async function roleSeed(prisma: PrismaClient): Promise<Role[]> {
    console.log('running seeders for roles 🌱');
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
