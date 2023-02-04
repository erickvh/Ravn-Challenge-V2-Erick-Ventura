import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

export const cleanDB = async () => {
    const prisma = new PrismaClient();

    try {
        await prisma.user.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.images.deleteMany();
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
};
