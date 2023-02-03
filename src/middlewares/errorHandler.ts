import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-json-validator-middleware';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        res.status(400).json({ error: err.validationErrors.body });
    } else {
        res.status(500).json({ error: err.message });
    }
    next();
};
