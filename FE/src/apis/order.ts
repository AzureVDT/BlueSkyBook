import { AxiosResponse } from "axios";
import axios from "./axios";
import { Order, OrderDetail } from "../types/orderTypes";

const getOrderByCustomerId = async (customerId: string) => {
    const response: AxiosResponse<Order[]> = await axios.get(
        `/order/customer/${customerId}`
    );
    return response;
};

const createOrder = async (order: Order) => {
    const response: AxiosResponse<Order> = await axios.post(
        "/order/create",
        order
    );
    return response;
};

const addOrderDetailToOrder = async (
    orderId: string,
    bookId: number,
    quantity: number
) => {
    const response: AxiosResponse<OrderDetail> = await axios.post(
        `/order/${orderId}/detail/create`,
        {
            bookId,
            quantity,
        }
    );
    return response;
};

const deleteOrder = async (orderId: string) => {
    const response: AxiosResponse<string> = await axios.delete(
        `/order/${orderId}/delete`
    );
    return response;
};

const getOrderDetailByOrderId = async (orderId: string) => {
    const response: AxiosResponse<OrderDetail[]> = await axios.get(
        `/order/${orderId}/detail`
    );
    return response;
};

const updateOrderDetailQuantity = async (orderId: string, quantity: number) => {
    const response: AxiosResponse<OrderDetail> = await axios.put(
        `/order/detail${orderId}/update?quantity=${quantity}`
    );
    return response;
};

const deleteOrderDetail = async (orderDetailId: string) => {
    const response: AxiosResponse<string> = await axios.delete(
        `/order/detail/${orderDetailId}/delete`
    );
    return response;
};

const deleteAllOrderByCustomerId = async (customerId: string) => {
    const response: AxiosResponse<string> = await axios.delete(
        `/order/${customerId}/delete`
    );
    return response;
};

export const ORDER = {
    getOrderByCustomerId,
    createOrder,
    addOrderDetailToOrder,
    getOrderDetailByOrderId,
    deleteOrder,
    updateOrderDetailQuantity,
    deleteOrderDetail,
    deleteAllOrderByCustomerId,
};
