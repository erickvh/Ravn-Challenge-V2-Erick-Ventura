export const buildReponseProduct = (product: any) => {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.Category.name,
        images: product.Images.map((image: any) => image.url),
    };
};
