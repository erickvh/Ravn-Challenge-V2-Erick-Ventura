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
