import { PrismaClient, Product } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { IProductRequest } from '../interfaces/product/product';

export class ProductFactory {
    protected readonly prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    async make(): Promise<Product> {
        let product: Product;
        try {
            product = await this.prismaClient.product.create({
                data: {
                    name: faker.commerce.productName(),
                    price: faker.commerce.price(),
                    description: faker.commerce.productDescription(),
                    stock: faker.datatype.number({ min: 1, max: 100 }),
                    Images: {
                        create: [{ url: faker.image.imageUrl() }, { url: faker.image.imageUrl() }],
                    },
                    Category: {
                        connectOrCreate: {
                            where: {
                                name: faker.commerce.department(),
                            },
                            create: {
                                name: faker.commerce.department(),
                            },
                        },
                    },
                },
            });
        } catch (err) {
            product = await this.make();
        }
        return product;
    }

    async makeUsingData(data: IProductRequest): Promise<Product> {
        const user = await this.prismaClient.product.create({
            data: {
                name: data.name,
                stock: data.stock,
                description: data.description,
                price: data.price,
                Category: {
                    connectOrCreate: {
                        where: {
                            name: data.category,
                        },
                        create: {
                            name: data.category,
                        },
                    },
                },
                Images: {
                    create: [{ url: 'https://via.placeholder.com/300/09f/fff.png' }],
                },
            },
        });

        return user;
    }
}
