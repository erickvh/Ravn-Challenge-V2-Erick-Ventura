import { faker } from '@faker-js/faker';
import { Like, PrismaClient } from '@prisma/client';

export async function likeSeed(prisma: PrismaClient) {
    console.log('running seeders for likes 🌱');
    const users = await prisma.user.findMany();

    const likes = users.map(async (user) => {
        return prisma.like.create({
            data: {
                User: {
                    connect: {
                        id: user.id,
                    },
                },
                Product: {
                    connect: {
                        id: faker.datatype.number({ min: 1, max: 10 }),
                    },
                },
            },
        });
    });

    return Promise.all(likes);
}
