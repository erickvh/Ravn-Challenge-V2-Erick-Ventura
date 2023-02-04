import { cleanDB, prisma } from '../database/prisma';
import { ProductFactory } from '../factories/product.factory';
import { UserFactory } from '../factories/user.factory';
import { ProductService } from './product.service';

describe('ProductService', () => {
    let productFactory: ProductFactory;
    let userFactory: UserFactory;
    beforeAll(() => {
        productFactory = new ProductFactory(prisma);
        userFactory = new UserFactory(prisma);
    });

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await cleanDB();
        await prisma.$disconnect();
    });

    it('should be defined user and product factory', () => {
        expect(productFactory).toBeDefined();
        expect(userFactory).toBeDefined();
    });

    describe('findAll', () => {
        it('should be able to list all products without filter', async () => {
            await productFactory.make();
            await productFactory.make();
            await productFactory.make();
            await productFactory.make();

            const products = await ProductService.getAll('', '1', '10');

            expect(products).toBeDefined();
            expect(products).toHaveLength(4);
            expect(products[0]).toHaveProperty('id');
            expect(products[0]).toHaveProperty('name');
        });

        it('should be able to list all products with filter', async () => {
            await productFactory.makeUsingData({
                name: 'Product 1',
                price: 10,
                description: 'Product 1 description',
                stock: 10,
                category: 'test',
            });

            const products = await ProductService.getAll('test', '1', '10');

            expect(products).toBeDefined();
            expect(products).toHaveLength(1);
            expect(products[0]).toHaveProperty('id');
            expect(products[0]).toHaveProperty('name');
        });
    });

    describe('findOne', () => {
        it('should be able to list one product', async () => {
            const product = await productFactory.make();

            const productFound = await ProductService.getOne(product.id.toString());

            expect(productFound).toBeDefined();
            expect(productFound).toHaveProperty('id');
            expect(productFound).toHaveProperty('name');
            expect(productFound).toHaveProperty('description');
            expect(productFound).toHaveProperty('price');
            expect(productFound).toHaveProperty('stock');
            expect(productFound).toHaveProperty('category');
        });

        it('should not be able to list one product with invalid id', async () => {
            await expect(ProductService.getOne('1000')).rejects.toThrow(new Error('Product not found'));
        });
    });

    describe('create', () => {
        it('should be able to create a new product', async () => {
            const product = await ProductService.create({
                name: 'Product 1',
                price: 10,
                description: 'Product 1 description',
                stock: 10,
                category: 'Category 1',
            });

            expect(product).toBeDefined();
            expect(product).toHaveProperty('name');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('description');
            expect(product).toHaveProperty('stock');
            expect(product).toHaveProperty('category');
        });

        it('should not be able to create a new product with invalid data', async () => {
            await expect(
                ProductService.create({
                    name: 'Product 1',
                    price: 10,
                    description: 'Product 1 description',
                    stock: 20,
                    category: '',
                }),
            ).rejects.toThrow(new Error('Category is required'));
        });
    });

    describe('update', () => {
        it('should be able to update a product', async () => {
            const product = await productFactory.make();
            const updatedProduct = await ProductService.update(product.id.toString(), {
                name: 'Product 1',
                price: 10,
                description: 'Product 1 description',
                stock: 10,
                category: 'Category 1',
            });

            expect(updatedProduct).toBeDefined();
            expect(updatedProduct.name).toEqual('Product 1');
            expect(updatedProduct.description).toEqual('Product 1 description');
        });

        it('should not be able to update a product that does not exists', async () => {
            await expect(
                ProductService.update('100', {
                    name: 'Product 1',
                    price: 10,
                    description: 'Product 1 description',
                    stock: 20,
                    category: '',
                }),
            ).rejects.toThrow(new Error('Product not found'));
        });
    });

    describe('delete', () => {
        it('should be able to delete a product', async () => {
            const product = await productFactory.make();
            const deletedProduct = await ProductService.delete(product.id.toString());

            expect(deletedProduct).toBeDefined();
            expect(deletedProduct.name).toEqual(product.name);
            expect(deletedProduct.description).toEqual(product.description);
        });

        it('should not be able to delete a product that does not exists', async () => {
            await expect(ProductService.delete('100')).rejects.toThrow(new Error('Product not found'));
        });
    });

    describe('disable', () => {
        it('should be able to disable a product', async () => {
            const product = await productFactory.make();
            const disabledProduct = await ProductService.disable(product.id.toString());

            expect(disabledProduct).toBeDefined();
            expect(disabledProduct.name).toEqual(product.name);
            expect(disabledProduct.description).toEqual(product.description);
        });

        it('should not be able to disable a product that does not exists', async () => {
            await expect(ProductService.disable('100')).rejects.toThrow(new Error('Product not found'));
        });
    });

    describe('uploadImage', () => {
        it('should be able to upload a product image', async () => {
            const product = await productFactory.make();
            const image = await ProductService.uploadImage(product.id.toString(), 'http://image.jpg');

            expect(image).toBeDefined();
            // it was added a new image, one more than the default (2)
            expect(image.images.length).toEqual(3);
        });

        it('should not be able to upload a product image that does not exists', async () => {
            await expect(ProductService.uploadImage('100', 'http://image.jpg')).rejects.toThrow(
                new Error('Product not found'),
            );
        });
    });
});
