import { AllowedSchema } from 'express-json-validator-middleware';

export const cartSchema: AllowedSchema = {
    type: 'object',
    required: ['productId'],
    properties: {
        productId: {
            type: 'integer',
            minimum: 1,
        },
        qty: {
            type: 'integer',
            minimum: 1,
        },
    },
};
