import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import { HttpError } from 'http-errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        res.status(422).json({ error: err.validationErrors.body });
    }

    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
    }

    if (err instanceof SyntaxError) {
        res.status(500).json({ error: 'An error has occurred' });
    }

    next();
};
