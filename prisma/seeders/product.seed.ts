import { faker } from '@faker-js/faker';
import { PrismaClient, Product } from '@prisma/client';

export async function productSeed(prisma: PrismaClient) {
    console.log('running seeders for products 🌱');
    let products = new Array(30);

    const categories = ['home', 'sports', 'office', 'toys'];

    for (let i = 0; i < products.length; i++) {
        products[i] = {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(1, 100, 2),
            images: [faker.image.imageUrl(), faker.image.imageUrl()],
            stock: faker.datatype.number({ min: 1, max: 100 }),
            category: categories[faker.datatype.number({ min: 0, max: 3 })],
        };
    }

    return Promise.allSettled(
        products.map((product) => {
            return prisma.product.create({
                data: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    Category: {
                        connectOrCreate: {
                            where: {
                                name: product.category,
                            },
                            create: {
                                name: product.category,
                            },
                        },
                    },
                    Images: {
                        create: product.images.map((image: string) => {
                            return {
                                url: image,
                            };
                        }),
                    },
                },
            });
        }),
    );
}
