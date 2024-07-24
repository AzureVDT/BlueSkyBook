type OrderBody = {
    customerId: number;
    paymentStatus: string;
    paymentMethod: string;
    orderDetails: {
        bookId: number;
        quantity: number;
    }[];
};

export type { OrderBody };
