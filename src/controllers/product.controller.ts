import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { IProductRequest } from '../interfaces/product/product';

export class ProductController {
    static async index(req: Request, res: Response) {
        let { q, page = '1', limit = '10' } = req.query;

        const products = await ProductService.getAll(q as string, page as string, limit as string);

        return res.status(200).json({ products });
    }

    static async show(req: Request, res: Response) {
        const product = await ProductService.getOne(req.params.id);

        return res.status(200).json({ product: product });
    }

    static async create(req: Request, res: Response) {
        const product = await ProductService.create(req.body as IProductRequest);
        res.status(201).json({ product: product, message: 'Product created' });
    }

    static async update(req: Request, res: Response) {
        const product = await ProductService.update(req.params.id, req.body as IProductRequest);

        res.status(200).json({ product: product, message: 'Product updated' });
    }

    static async delete(req: Request, res: Response) {
        const removedProduct = await ProductService.delete(req.params.id);

        return res.status(200).json({ product: removedProduct, message: 'Product deleted' });
    }

    static async disable(req: Request, res: Response) {
        await ProductService.disable(req.params.id);

        return res.status(200).json({ message: 'Product disabled' });
    }

    static async uploadImage(req: Request, res: Response) {
        const { url } = req.body;
        const product = await ProductService.uploadImage(req.params.id, url);

        return res.status(200).json({ product: product, message: 'Image uploaded' });
    }
}
