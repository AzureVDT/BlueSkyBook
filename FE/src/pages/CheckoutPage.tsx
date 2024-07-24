import React, { useState, useEffect } from "react";
import {
    Tabs,
    Table,
    Checkbox,
    Button,
    Select,
    Row,
    Col,
    InputNumber,
    message,
    Modal,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Order, OrderDetail } from "../types/orderTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import { setTriggerFetchingCart } from "../store/actions/commonSlice";
import { BLUE_STORE_BOOK_API } from "../apis";
import handleFormatTime from "../utils/handleFormatTime";

const { TabPane } = Tabs;
const { Option } = Select;

interface CartItem {
    bookId: number;
    quantity: number;
    name: string;
    price: number;
    thumbnail: string;
    availableQuantity: number;
}

const CheckoutPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>(
        JSON.parse(sessionStorage.getItem("cartItems") || "[]")
    );
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [visibleModal, setVisibleModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState<
        OrderDetail[]
    >([]);
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const triggerFetchingCart = useSelector(
        (state: RootState) => state.common.triggerFetchingCart
    );

    const handleSelectAll = (e: CheckboxChangeEvent) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map((item) => item.bookId));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (bookId: number) => {
        setSelectedItems((prev) =>
            prev.includes(bookId)
                ? prev.filter((id) => id !== bookId)
                : [...prev, bookId]
        );
    };

    const handleDeleteSelected = (bookId?: number) => {
        const itemsToDelete = bookId ? [bookId] : selectedItems;
        if (itemsToDelete.length === 0) {
            message.warning("Please select at least one item to delete.");
            return;
        }

        const newCartItems = cartItems.filter(
            (item) => !itemsToDelete.includes(item.bookId)
        );
        setCartItems(newCartItems);
        setSelectedItems((prev) =>
            bookId ? prev.filter((id) => id !== bookId) : []
        );
        dispatch(setTriggerFetchingCart(!triggerFetchingCart));
        sessionStorage.setItem("cartItems", JSON.stringify(newCartItems));
    };

    const handleDeleteItem = (bookId: number) => {
        if (!selectedItems.includes(bookId)) {
            message.warning("Please select the item before deleting.");
            return;
        }
        handleDeleteSelected(bookId);
    };

    const handleCheckout = async () => {
        setLoading(true);
        if (!paymentMethod) {
            message.warning("Please select payment method.");
            setLoading(false);
            return;
        }
        if (!selectedItems.length) {
            message.warning("Please select at least one item to checkout.");
            setLoading(false);
            return;
        }

        const overQuantityItems = cartItems.filter(
            (item) =>
                selectedItems.includes(item.bookId) &&
                item.quantity > item.availableQuantity
        );

        if (overQuantityItems.length > 0) {
            message.warning(
                `The quantity of the following items is not enough: ${overQuantityItems
                    .map(
                        (item) =>
                            `${item.name} (available: ${item.availableQuantity})`
                    )
                    .join(", ")}. Please update the quantity before checkout.`
            );
            setLoading(false);
            return;
        }

        const order = {
            customerId: userInfo.id,
            paymentStatus: "PENDING",
            paymentMethod,
            orderDetails: cartItems
                .filter((item) => selectedItems.includes(item.bookId))
                .map((item) => ({
                    bookId: item.bookId,
                    quantity: item.quantity,
                })),
        };

        try {
            const response = await BLUE_STORE_BOOK_API.ORDER.createOrder(order);
            if (response.status === 200) {
                message.success("Checkout successfully.");
                setCartItems([]);
                setSelectedItems([]);
                setOrderHistory((prev) => [...prev, response.data]);
                dispatch(setTriggerFetchingCart(!triggerFetchingCart));
                const newCartItems = cartItems.filter(
                    (item) => !selectedItems.includes(item.bookId)
                );
                setCartItems(newCartItems);
                sessionStorage.setItem(
                    "cartItems",
                    JSON.stringify(newCartItems)
                );
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            message.error("Failed to checkout. Please try again.");
        }
    };

    const handleQuantityChange = (bookId: number, quantity: number) => {
        const newCartItems = cartItems.map((item) =>
            item.bookId === bookId ? { ...item, quantity } : item
        );
        setCartItems(newCartItems);
        sessionStorage.setItem("cartItems", JSON.stringify(newCartItems));
    };

    const columns = [
        {
            title: <Checkbox onChange={handleSelectAll} />,
            dataIndex: "bookId",
            render: (bookId: number) => (
                <Checkbox
                    checked={selectedItems.includes(bookId)}
                    onChange={() => handleSelectItem(bookId)}
                />
            ),
        },
        {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            render: (thumbnail: string) => (
                <img src={thumbnail} alt="Thumbnail" style={{ width: 50 }} />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (_: unknown, record: CartItem) =>
                `$${(record.price * record.quantity).toFixed(2)}`,
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            render: (_: unknown, record: CartItem) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={record.quantity}
                    onChange={(value) =>
                        handleQuantityChange(record.bookId, value as number)
                    }
                />
            ),
        },
        {
            title: "Actions",
            dataIndex: "bookId",
            render: (bookId: number) => (
                <Button
                    onClick={() => handleDeleteItem(bookId)}
                    type="text"
                    danger
                >
                    Delete
                </Button>
            ),
        },
    ];

    const handleViewDetails = (orderDetails: OrderDetail[]) => {
        setSelectedOrderDetails(orderDetails);
        setVisibleModal(true);
    };

    const orderColumns = [
        {
            title: "Order ID",
            dataIndex: "id",
        },
        {
            title: "Order Date",
            dataIndex: "orderDate",
            render: (orderDate: string) => handleFormatTime(orderDate),
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
        },
        {
            title: "Payment Status",
            dataIndex: "paymentStatus",
        },
        {
            title: "Total Money",
            dataIndex: "orderDetails",
            render: (orderDetails: OrderDetail[]) =>
                `$${orderDetails
                    .reduce(
                        (acc, detail) =>
                            acc + detail.book.price * detail.quantity,
                        0
                    )
                    .toFixed(2)}`,
        },
        {
            title: "Actions",
            dataIndex: "id",
            render: (_: unknown, record: Order) => (
                <Button onClick={() => handleViewDetails(record.orderDetails)}>
                    View Details
                </Button>
            ),
        },
    ];

    const totalQuantity = selectedItems.reduce(
        (acc, bookId) =>
            acc +
            (cartItems.find((item) => item.bookId === bookId)?.quantity || 0),
        0
    );

    const totalPrice = selectedItems.reduce(
        (acc, bookId) =>
            acc +
            (cartItems.find((item) => item.bookId === bookId)?.price || 0) *
                (cartItems.find((item) => item.bookId === bookId)?.quantity ||
                    0),
        0
    );

    useEffect(() => {
        async function fetchData() {
            try {
                const response =
                    await BLUE_STORE_BOOK_API.ORDER.getOrderByCustomerId(
                        userInfo.id
                    );
                if (response.status === 200) {
                    setOrderHistory(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [userInfo.id]);

    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Cart Items" key="1">
                    <Table
                        dataSource={cartItems}
                        columns={columns}
                        rowKey="bookId"
                        footer={() => (
                            <Row>
                                <Col span={12}>
                                    <Row gutter={6}>
                                        <Col span={8}>
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={() =>
                                                    handleDeleteSelected()
                                                }
                                            >
                                                Delete Selected
                                            </Button>
                                        </Col>
                                        <Col span={8}>
                                            <Button
                                                type="primary"
                                                loading={loading}
                                                onClick={handleCheckout}
                                            >
                                                Checkout
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12} style={{ textAlign: "right" }}>
                                    <Select
                                        value={paymentMethod}
                                        onChange={setPaymentMethod}
                                        placeholder="Select Payment Method"
                                        style={{ width: 200 }}
                                    >
                                        <Option value="CASH">CASH</Option>
                                        <Option value="PAYPAL">PAYPAL</Option>
                                        <Option value="CREDIT_CARD">
                                            CREDIT CARD
                                        </Option>
                                    </Select>
                                </Col>
                                <Col span={24}>
                                    <p style={{ textAlign: "right" }}>
                                        Total ({totalQuantity} items): $
                                        {totalPrice.toFixed(2)}
                                    </p>
                                </Col>
                            </Row>
                        )}
                    />
                </TabPane>
                <TabPane tab="Order History" key="2">
                    <Table
                        dataSource={orderHistory}
                        columns={orderColumns}
                        rowKey="id"
                    />
                </TabPane>
            </Tabs>

            <Modal
                title="Order Details"
                visible={visibleModal}
                onCancel={() => setVisibleModal(false)}
                footer={[
                    <Button key="close" onClick={() => setVisibleModal(false)}>
                        Close
                    </Button>,
                ]}
            >
                <Table
                    dataSource={selectedOrderDetails}
                    columns={[
                        {
                            title: "Book Name",
                            dataIndex: ["book", "bookname"],
                        },
                        {
                            title: "Quantity",
                            dataIndex: "quantity",
                        },
                        {
                            title: "Price",
                            dataIndex: ["book", "price"],
                            render: (price: number) => `$${price.toFixed(2)}`,
                        },
                        {
                            title: "Thumbnail",
                            dataIndex: ["book", "thumbnail"],
                            render: (thumbnail: string) => (
                                <img
                                    src={thumbnail}
                                    alt="Thumbnail"
                                    style={{ width: 50 }}
                                />
                            ),
                        },
                    ]}
                    rowKey="bookId"
                    pagination={false}
                />
            </Modal>
        </div>
    );
};

export default CheckoutPage;
