import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import { HttpError } from 'http-errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        if (err.validationErrors.params) return res.status(422).json({ errors: err.validationErrors.params });
        if (err.validationErrors.query) return res.status(422).json({ errors: err.validationErrors.query });
        if (err.validationErrors.body) return res.status(422).json({ errors: err.validationErrors.body });
    }

    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Internal error' });
};
