import { Request, NextFunction, Response } from 'express';
import { IUserResponse } from '../../interfaces/auth/user';
import { Forbidden } from 'http-errors';

export const validateClient = (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user as IUserResponse;

    if (role.name !== 'client') throw new Forbidden('This resource is only available for clients');

    next();
};
