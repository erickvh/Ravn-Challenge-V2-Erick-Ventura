import { prisma } from '../database/prisma';
import { IProductRequest, IProductResponse } from '../interfaces/product/product';
import { NotFound } from 'http-errors';
import { IUserResponse } from '../interfaces/auth/user';
import { Prisma, Product } from '@prisma/client';

export class ProductService {
    static async getAll(search: string, currentPage: number, size: number): Promise<IProductResponse[]> {
        const products = await prisma.product.findMany({
            take: size,
            skip: (currentPage - 1) * size,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                Category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.Category.name,
            };
        });
    }

    static async getOne(id: string): Promise<IProductResponse> {
        const product = await prisma.product.findFirst({
            where: {
                id: parseInt(id),
                is_active: true,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                Category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!product) throw new NotFound('Product not found');

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.Category.name,
        };
    }

    static async create(product: IProductRequest): Promise<IProductResponse> {
        const productCreated = await prisma.product.create({
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
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                Category: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return {
            id: productCreated.id,
            name: productCreated.name,
            description: productCreated.description,
            price: productCreated.price,
            stock: productCreated.stock,
            category: productCreated.Category.name,
        };
    }

    static async update(id: string, product: IProductRequest): Promise<IProductResponse> {
        try {
            const productUpdated = await prisma.product.update({
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
                },
                where: {
                    id: parseInt(id),
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    stock: true,
                    Category: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            return {
                id: productUpdated.id,
                price: productUpdated.price,
                name: productUpdated.name,
                description: productUpdated.description,
                stock: productUpdated.stock,
                category: productUpdated.Category.name,
            };
        } catch {
            throw new NotFound('Product not found');
        }
    }

    static async delete(id: string): Promise<IProductResponse> {
        try {
            const removedUser = await prisma.product.delete({
                where: {
                    id: parseInt(id),
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    stock: true,
                    Category: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            return {
                id: removedUser.id,
                name: removedUser.name,
                description: removedUser.description,
                price: removedUser.price,
                stock: removedUser.stock,
                category: removedUser.Category.name,
            };
        } catch {
            throw new NotFound('Product not found');
        }
    }

    static async disable(id: string): Promise<IProductResponse> {
        const product = await prisma.product.findFirst({
            where: {
                id: parseInt(id),
                is_active: true,
            },
        });

        if (!product) throw new NotFound('Product not found');

        const productUpdated = await prisma.product.update({
            where: {
                id: parseInt(id),
            },
            data: {
                is_active: false,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                Category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return {
            id: productUpdated.id,
            name: productUpdated.name,
            description: productUpdated.description,
            price: productUpdated.price,
            stock: productUpdated.stock,
            category: productUpdated.Category.name,
        };
    }
}
