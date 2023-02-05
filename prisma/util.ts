import { prisma } from '../src/database/prisma';

export async function clearSchema() {
    const tables = ['users', 'products', 'categories', 'images'];

    for (const table of tables) {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${table}_id_seq" RESTART WITH 1;`);
    }
}
