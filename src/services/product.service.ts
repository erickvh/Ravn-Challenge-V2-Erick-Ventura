import { prisma } from '../database/prisma';
import { IProductRequest, IProductResponse } from '../interfaces/product/product';
import { NotFound, BadRequest } from 'http-errors';
import { buildReponseProduct } from './utils/buildResponses';
import { selectProducts } from './utils/selects';

export class ProductService {
    static async getAll(search: string, currentPage: string, size: string): Promise<IProductResponse[]> {
        // add search filter
        let categoryFilter = {};
        if (search) {
            categoryFilter = {
                Category: {
                    name: {
                        contains: search,
                    },
                },
            };
        }

        // paginate data and filters
        try {
            const products = await prisma.product.findMany({
                where: {
                    is_active: true,
                    ...categoryFilter,
                },
                take: parseInt(size),
                skip: (parseInt(currentPage) - 1) * parseInt(size),
                ...selectProducts,
            });

            return products.map((product) => {
                return buildReponseProduct(product);
            });
        } catch {
            throw new BadRequest('Invalid query params');
        }
    }

    static async getOne(id: string): Promise<IProductResponse> {
        const product = await prisma.product.findFirst({
            where: {
                id: parseInt(id),
                is_active: true,
            },
            ...selectProducts,
        });

        if (!product) throw new NotFound('Product not found');

        return buildReponseProduct(product);
    }

    static async create(product: IProductRequest): Promise<IProductResponse> {
        if (!product.category) throw new BadRequest('Category is required');

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
            ...selectProducts,
        });
        return buildReponseProduct(productCreated);
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
                ...selectProducts,
            });

            return buildReponseProduct(productUpdated);
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
                ...selectProducts,
            });

            return buildReponseProduct(removedUser);
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
            ...selectProducts,
        });

        return buildReponseProduct(productUpdated);
    }

    static async uploadImage(id: string, image: string) {
        const product = await prisma.product.findFirst({
            where: {
                id: parseInt(id),
                is_active: true,
            },
        });

        if (!product) throw new NotFound('Product not found');

        const imageUpdated = await prisma.images.create({
            data: {
                url: image,
            },
        });

        const productUpdated = await prisma.product.update({
            where: {
                id: parseInt(id),
            },
            data: {
                Images: {
                    connect: {
                        id: imageUpdated.id,
                    },
                },
            },
            ...selectProducts,
        });

        return buildReponseProduct(productUpdated);
    }
}
