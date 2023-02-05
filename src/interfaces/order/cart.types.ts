import { Product } from '@prisma/client';

export type CartItems = {
    quantity: number;
    Product: Product;
};
