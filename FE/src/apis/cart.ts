import { AxiosResponse } from "axios";
import { CartItem } from "../types/commonType";
import axios from "./axios";

const saveCart = async (carts: CartItem[], customerId: number) => {
    const response: AxiosResponse<CartItem[]> = await axios.post(
        `/carts/save/${customerId}`,
        carts
    );
    return response;
};

const getCartByCustomerId = async (customerId: number) => {
    const response: AxiosResponse<CartItem[]> = await axios.get(
        `/carts/customer/${customerId}`
    );
    return response;
};

export const CART = {
    saveCart,
    getCartByCustomerId,
};
