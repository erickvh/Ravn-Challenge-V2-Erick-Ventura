import { AllowedSchema } from 'express-json-validator-middleware';

export const forgotSchema: AllowedSchema = {
    type: 'object',
    required: ['email'],
    properties: {
        email: {
            type: 'string',
        },
    },
};
