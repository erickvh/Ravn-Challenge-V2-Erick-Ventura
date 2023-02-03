import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import { HttpError } from 'http-errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        return res.status(422).json({ errors: err.validationErrors.body });
    }

    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    if (err instanceof SyntaxError) {
        return res.status(500).json({ message: 'Internal server Error' });
    }
    next(err);
};
