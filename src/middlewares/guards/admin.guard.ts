import { Request, NextFunction, Response } from 'express';
import { IUserResponse } from '../../interfaces/auth/user';
import { Forbidden } from 'http-errors';

export const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user as IUserResponse;

    if (role.name !== 'manager') throw new Forbidden('You are not allowed to access this resource');

    next();
};
