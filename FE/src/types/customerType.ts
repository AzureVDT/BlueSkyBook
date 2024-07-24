type LoginResponse = {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    address: string;
    password: string;
    role: string;
};

type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    address: string;
    role: string;
};

export type { LoginResponse, Customer };
