import { AllowedSchema } from 'express-json-validator-middleware';

export const resetSchema: AllowedSchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
    },
};
