import { AllowedSchema } from 'express-json-validator-middleware';

export const signupSchema: AllowedSchema = {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
        email: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
    },
};
