import { Decimal } from '@prisma/client/runtime';

export interface IProductRequest {
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    stock: number;
}

export interface IProductResponse {
    id: number;
    name: string;
    description: string;
    price: Decimal | number;
    category: string;
    stock: number;
}
