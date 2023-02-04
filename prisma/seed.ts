import { PrismaClient } from '@prisma/client';
import { roleSeed } from './seeders/role.seed';
import { userSeed } from './seeders/user.seed';
import { productSeed } from './seeders/product.seed';

const prisma = new PrismaClient();

async function clearSchema() {
    const tables = ['users', 'products', 'categories', 'images'];
    console.log('Clearing schema... 🧹');
    for (const table of tables) {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${table}_id_seq" RESTART WITH 1;`);
    }
    console.log('Schema cleared! 🧹');
}

async function main() {
    await clearSchema();
    await roleSeed(prisma);
    await userSeed(prisma);
    await productSeed(prisma);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
