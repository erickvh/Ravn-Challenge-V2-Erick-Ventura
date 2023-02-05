import { AllowedSchema } from 'express-json-validator-middleware';

export const orderSchema: AllowedSchema = {
    type: 'object',
    required: ['address'],
    properties: {
        address: {
            type: 'string',
            minLength: 4,
        },
    },
};
