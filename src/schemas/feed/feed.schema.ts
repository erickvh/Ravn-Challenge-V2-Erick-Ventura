import { AllowedSchema } from 'express-json-validator-middleware';

export const likeSchema: AllowedSchema = {
    type: 'object',
    properties: {
        productId: {
            type: 'integer',
            minimum: 1,
        },
    },
};
