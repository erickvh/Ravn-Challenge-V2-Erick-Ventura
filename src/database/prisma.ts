import { PrismaClient } from '@prisma/client';
import { clearSchema } from '../../prisma/util';
export const prisma = new PrismaClient();

export const cleanDB = async () => {
    const prisma = new PrismaClient();
    await clearSchema();
    try {
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
};
