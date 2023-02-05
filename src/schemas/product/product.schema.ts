import { AllowedSchema } from 'express-json-validator-middleware';

export const productSchema: AllowedSchema = {
    type: 'object',
    required: ['name', 'description', 'price', 'category'],
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        price: {
            type: 'number',
        },
        category: {
            type: 'string',
        },
        stock: {
            type: 'number',
        },
    },
};

export const productIdSchema = {
    type: 'integer',
    minimum: 1,
};

export const searchProductSchema: AllowedSchema = {
    type: 'object',
    properties: {
        search: {
            type: 'string',
        },
        page: {
            type: 'string',
        },
        limit: {
            type: 'string',
        },
    },
};

export const uploadImageSchema: AllowedSchema = {
    type: 'object',
    required: ['url'],
    properties: {
        url: {
            type: 'string',
        },
    },
};
