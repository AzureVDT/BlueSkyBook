import { useEffect, useState } from "react";
import RequireAdminPage from "./RequireAdminPage";
import { Customer } from "../types/customerType";
import { BLUE_STORE_BOOK_API } from "../apis";
import { Image, Table } from "antd";

interface DataType {
    key: React.Key;
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
}

const CustomerPage = () => {
    const [customers, setCustomers] = useState<DataType[]>([]);

    useEffect(() => {
        async function fetchData() {
            const response = await BLUE_STORE_BOOK_API.AUTH.getAllCustomers();
            if (response.status === 200) {
                const newCustomers = response.data.filter(
                    (customer: Customer) => customer.role === "CUSTOMER"
                );
                const formattedData = newCustomers.map(
                    (customer: Customer, index: number) => ({
                        key: index,
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone || "-",
                        address: customer.address || "-",
                        avatar: customer.avatar,
                    })
                );
                setCustomers(formattedData);
            }
        }
        fetchData();
    }, []);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Avatar",
            key: "avatar",
            dataIndex: "avatar",
            render: (avatar: string) => {
                return (
                    <Image
                        src={avatar}
                        alt="avatar"
                        style={{ width: "50px", height: "50px" }}
                    />
                );
            },
        },
    ];

    return (
        <RequireAdminPage>
            <div>
                <Table columns={columns} dataSource={customers} />
            </div>
        </RequireAdminPage>
    );
};

export default CustomerPage;
