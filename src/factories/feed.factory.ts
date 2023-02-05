import { PrismaClient } from '@prisma/client';

export class FeedFactory {
    protected readonly prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    async makeUsingData(userId: number, productId: number) {
        this.prismaClient.like.create({
            data: {
                User: {
                    connect: {
                        id: userId,
                    },
                },
                Product: {
                    connect: {
                        id: productId,
                    },
                },
            },
        });
    }
}
