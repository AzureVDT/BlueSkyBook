import { Book } from "./bookTypes";
import { Customer } from "./customerType";

type Order = {
    id: number;
    customer: Customer;
    orderDate: string;
    paymentMethod: string;
    orderDetails: OrderDetail[];
    paymentStatus: string;
};

type OrderDetail = {
    id: number;
    book: Book;
    quantity: number;
};

export type { Order, OrderDetail };
