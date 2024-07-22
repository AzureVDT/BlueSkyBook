import { AxiosResponse } from "axios";
import axios from "./axios";
import { LoginResponse } from "../types/customerType";

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
    });
    return response;
};

export const AUTH = {
    login,
    signup,
};
