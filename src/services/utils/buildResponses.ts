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

export const buildReponseOrder = (order: any) => {
    return {
        orderId: order.id,
        address: order.address,
        status: order.status,
        user: {
            id: order.User.id,
            name: order.User.name,
            email: order.User.email,
        },
        items: order.OrderItem.map((item: any) => ({
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price,
            product: {
                id: item.Product.id,
                name: item.Product.name,
                description: item.Product.description,
            },
        })),
        total: order.OrderItem.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
};
