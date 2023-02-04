import { Router } from 'express';
import { validate } from '../middlewares/schemaValidator';
import passport from 'passport';
import { ProductController } from '../controllers/product.controller';
import { productSchema, searchProductSchema, uploadImageSchema } from '../schemas/product/product.schema';
import { paramIdInt } from '../middlewares/paramIdInt';
import { validateAdmin } from '../middlewares/guards/admin.guard';

export function productRoutes(): Router {
    const router = Router();
    router.get('/', validate({ query: searchProductSchema }), ProductController.index);

    router.post(
        '/',
        passport.authenticate('jwt', { session: false }),
        validateAdmin,
        validate({ body: productSchema }),
        ProductController.create,
    );

    router.put(
        '/:id',
        passport.authenticate('jwt', { session: false }),
        validateAdmin,
        validate({ body: productSchema }),
        paramIdInt,
        ProductController.update,
    );
    router.get('/:id', paramIdInt, ProductController.show);

    router.delete(
        '/:id',
        passport.authenticate('jwt', { session: false }),
        validateAdmin,
        paramIdInt,
        ProductController.delete,
    );
    router.put(
        '/:id/disable',
        passport.authenticate('jwt', { session: false }),
        validateAdmin,
        paramIdInt,
        ProductController.disable,
    );

    router.put(
        '/:id/image',
        passport.authenticate('jwt', { session: false }),
        validateAdmin,
        validate({ body: uploadImageSchema }),
        paramIdInt,
        ProductController.uploadImage,
    );

    return router;
}
