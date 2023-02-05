export const selectProducts = {
    select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        Category: {
            select: {
                name: true,
            },
        },
        Images: {
            select: {
                url: true,
            },
        },
    },
};

export const selectCarts = {
    select: {
        id: true,
        userId: true,
        isDraft: true,
        CartItems: {
            select: {
                quantity: true,
                Product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        description: true,
                        stock: true,
                    },
                },
            },
        },
    },
};

export const selectOrders = {
    select: {
        id: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        OrderItem: {
            select: {
                id: true,
                quantity: true,
                price: true,
                Product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        },
        User: {
            select: {
                id: true,
                name: true,
                email: true,
            },
        },
    },
};
