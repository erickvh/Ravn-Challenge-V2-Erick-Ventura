import { roleSeed } from './seeders/role.seed';
import { userSeed } from './seeders/user.seed';
import { productSeed } from './seeders/product.seed';
import { likeSeed } from './seeders/likes.seed';
import { clearSchema } from './util';
import { prisma } from '../src/database/prisma';
async function main() {
    await clearSchema();
    await roleSeed(prisma);
    await userSeed(prisma);
    await productSeed(prisma);
    await likeSeed(prisma);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
