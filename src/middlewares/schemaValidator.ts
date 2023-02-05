import { Validator } from 'express-json-validator-middleware';

const validator = new Validator({ allErrors: true });

export const validate = validator.validate;
