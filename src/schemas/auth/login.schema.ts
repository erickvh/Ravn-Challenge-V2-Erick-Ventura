import { AllowedSchema } from 'express-json-validator-middleware';

export const loginSchema: AllowedSchema = {
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
