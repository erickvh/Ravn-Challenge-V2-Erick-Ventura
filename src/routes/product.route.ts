import { Router } from 'express';
import { validate } from '../middlewares/schemaValidator';
import passport from 'passport';
import { ProductController } from '../controllers/product.controller';
import { productSchema, productIdSchema } from '../schemas/product/product.schema';
import { paramIdInt } from '../middlewares/paramIdInt';

export function productRoutes(): Router {
    const router = Router();
    router.get('/', ProductController.index);
    router.post('/create', validate({ body: productSchema }), ProductController.create);
    router.put('/:id', validate({ body: productSchema }), paramIdInt, ProductController.update);
    router.get('/:id', paramIdInt, ProductController.show);
    router.delete('/:id', paramIdInt, ProductController.delete);
    router.put('/:id/disable', paramIdInt, ProductController.disable);

    // router.post('/login', validate({ body: loginSchema }), AuthController.logIn);
    // router.post('/signup', validate({ body: signupSchema }), AuthController.singUp);
    // router.post('/logout', passport.authenticate('jwt', { session: false }), AuthController.logOut);

    return router;
}
