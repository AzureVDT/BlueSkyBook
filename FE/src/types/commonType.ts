type OrderBody = {
    customerId: number;
    paymentStatus: string;
    paymentMethod: string;
    orderDetails: {
        bookId: number;
        quantity: number;
    }[];
};

type CartItem = {
    bookId: number;
    name: string;
    price: number;
    quantity: number;
    availableQuantity: number;
    thumbnail: string;
};

export type { OrderBody, CartItem };
