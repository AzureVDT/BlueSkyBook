import { AxiosResponse } from "axios";
import axios from "./axios";
import { Customer, LoginResponse } from "../types/customerType";

const login = async (email: string, password: string) => {
    const response: AxiosResponse<LoginResponse> = await axios.post(
        "/auth/login",
        {
            email,
            password,
        }
    );
    return response;
};

const signup = async (name: string, email: string, password: string) => {
    const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
        role: "CUSTOMER",
    });
    return response;
};

const updateProfile = async (
    data: {
        name: string;
        email: string;
        phone: string;
        avatar: string;
        address: string;
    },
    id: number
) => {
    const response = await axios.put(`/customer/${id}/update`, data);
    return response;
};

const updatePassword = async (new_password: string, id: number) => {
    const response = await axios.put(`/customer/${id}/update/password`, {
        new_password,
    });
    return response;
};

const getAllCustomers = async () => {
    const response: AxiosResponse<Customer[]> = await axios.get(
        "/customer/all"
    );
    return response;
};

export const AUTH = {
    login,
    signup,
    updateProfile,
    updatePassword,
    getAllCustomers,
};
