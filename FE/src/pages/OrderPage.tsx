import { useEffect, useState } from "react";
import { BLUE_STORE_BOOK_API } from "../apis";
import { Order, OrderDetail } from "../types/orderTypes";
import { Space, Table, Tag, Modal, Image } from "antd";
import { ColumnsType } from "antd/es/table";
import handleFormatTime from "../utils/handleFormatTime";
import { Customer } from "../types/customerType";
import RequireAdminPage from "./RequireAdminPage";

const OrderPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await BLUE_STORE_BOOK_API.ORDER.getAllOrder();
            if (response.status === 200) {
                setOrders(response.data);
            }
        };
        fetchOrders();
    }, []);

    const calculateTotalCost = (orderDetails: OrderDetail[]) => {
        return orderDetails.reduce((total, detail) => {
            return total + detail.quantity * detail.book.price;
        }, 0);
    };

    const columns: ColumnsType<Order> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Order Date",
            dataIndex: "orderDate",
            key: "orderDate",
            render: (orderDate) => handleFormatTime(orderDate),
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (paymentMethod) => (
                <Tag color="blue" key={paymentMethod}>
                    {paymentMethod}
                </Tag>
            ),
        },
        {
            title: "Payment Status",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (paymentStatus) => {
                let color = "";
                let text = "";
                switch (paymentStatus) {
                    case "PENDING":
                        color = "orange";
                        text = "Pending";
                        break;
                    case "PAID":
                        color = "green";
                        text = "Paid";
                        break;
                    case "CANCELLED":
                        color = "red";
                        text = "Cancelled";
                        break;
                    default:
                        color = "gray";
                        text = "Unknown";
                }
                return (
                    <Tag color={color} key={paymentStatus}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: "Total Cost",
            key: "totalCost",
            render: (_, record) => calculateTotalCost(record.orderDetails),
        },
        {
            title: "Details",
            key: "orderDetails",
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => setSelectedOrder(record)}>View Detail</a>
                </Space>
            ),
        },
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => setSelectedCustomer(record.customer)}>
                        View Detail
                    </a>
                </Space>
            ),
        },
    ];

    const orderDetailColumns: ColumnsType<OrderDetail> = [
        {
            title: "ID",
            dataIndex: ["book", "id"],
            key: "id",
        },
        {
            title: "Book Name",
            dataIndex: ["book", "bookname"],
            key: "bookname",
        },
        {
            title: "Thumbnail",
            dataIndex: ["book", "thumbnail"],
            key: "thumbnail",
            render: (thumbnail) => (
                <img src={thumbnail} alt="book" width={50} />
            ),
        },
        {
            title: "Price",
            dataIndex: ["book", "price"],
            key: "price",
            render: (price) => `$${price}`,
        },
    ];
    const customerColumn: ColumnsType<Customer> = [
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
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                        }}
                    />
                );
            },
        },
    ];

    return (
        <RequireAdminPage>
            <Table columns={columns} dataSource={orders} />
            <Modal
                title="Order Details"
                open={selectedOrder !== null}
                onCancel={() => setSelectedOrder(null)}
                footer={null}
            >
                {selectedOrder && (
                    <Table
                        columns={orderDetailColumns}
                        dataSource={selectedOrder.orderDetails}
                    />
                )}
            </Modal>
            <Modal
                title="Customer Details"
                open={selectedCustomer !== null}
                onCancel={() => setSelectedCustomer(null)}
                footer={null}
                width={800}
            >
                {selectedCustomer && (
                    <Table
                        columns={customerColumn}
                        dataSource={[selectedCustomer]}
                    />
                )}
            </Modal>
        </RequireAdminPage>
    );
};

export default OrderPage;
