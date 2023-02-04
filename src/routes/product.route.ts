import { Router } from 'express';
import { validate } from '../middlewares/schemaValidator';
import passport from 'passport';
import { ProductController } from '../controllers/product.controller';
import { productSchema, searchProductSchema, uploadImageSchema } from '../schemas/product/product.schema';
import { paramIdInt } from '../middlewares/paramIdInt';

export function productRoutes(): Router {
    const router = Router();
    router.get('/', validate({ query: searchProductSchema }), ProductController.index);
    router.post('/create', validate({ body: productSchema }), ProductController.create);
    router.put('/:id', validate({ body: productSchema }), paramIdInt, ProductController.update);
    router.get('/:id', validate({ body: uploadImageSchema }), paramIdInt, ProductController.show);
    router.delete('/:id', paramIdInt, ProductController.delete);
    router.put('/:id/disable', paramIdInt, ProductController.disable);
    router.put('/:id/image', paramIdInt, ProductController.uploadImage);

    return router;
}
