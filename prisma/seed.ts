import { PrismaClient } from '@prisma/client';
import { userSeed } from './seeders/user.seed';
import { roleSeed } from './seeders/role.seed';

const prisma = new PrismaClient();

async function main() {
    await Promise.all([roleSeed(prisma), userSeed(prisma)]);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
