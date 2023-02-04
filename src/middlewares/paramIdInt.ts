import Ajv from 'ajv';
import { NextFunction, Request, Response } from 'express';
import { productIdSchema } from '../schemas/product/product.schema';

const ajv = new Ajv();

const validatorId = ajv.compile(productIdSchema);

export function paramIdInt(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    const valid = validatorId(id);

    if (!valid) {
        return res.status(422).json({ errors: validatorId.errors });
    }

    next();
}
