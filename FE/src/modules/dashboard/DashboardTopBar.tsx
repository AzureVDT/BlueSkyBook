import { Badge, Button, Layout, List, Popover, Typography } from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import { Header } from "antd/es/layout/layout";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGenre } from "../../store/actions/bookSlice";
import { useEffect, useState } from "react";
import { RootState } from "../../store/configureStore";

const DashboardTopBar = () => {
    const navigate = useNavigate();
    const triggerFetchingCart = useSelector(
        (state: RootState) => state.common.triggerFetchingCart
    );
    const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
        console.log(info?.source, value);
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState<
        {
            bookId: number;
            quantity: number;
            name: string;
            price: number;
            thumbnail: string;
            availableQuantity: number;
        }[]
    >(JSON.parse(sessionStorage.getItem("cartItems") || "[]"));

    useEffect(() => {
        setCartItems(JSON.parse(sessionStorage.getItem("cartItems") || "[]"));
    }, [triggerFetchingCart]);

    const cartPopoverContent = (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={cartItems}
                className="w-[300px] h-full max-h-[400px] overflow-auto"
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <img
                                    src={item.thumbnail}
                                    alt={item.name}
                                    style={{ width: 50 }}
                                />
                            }
                            title={item.name}
                            description={`$${(
                                item.quantity * item.price
                            ).toFixed(2)} x${item.quantity}`}
                        />
                    </List.Item>
                )}
            />
            <Typography.Title level={5}>
                Total: $
                {cartItems
                    .reduce((acc, item) => acc + item.quantity * item.price, 0)
                    .toFixed(2)}
            </Typography.Title>
            <Button type="primary" block onClick={() => navigate("/checkout")}>
                View Cart
            </Button>
        </div>
    );

    return (
        <Layout>
            <Header className="flex items-center justify-between bg-lite w-full h-[64px]">
                <div className="flex items-center justify-center h-full gap-x-5">
                    <div
                        className="w-[200px] h-full cursor-pointer"
                        onClick={() => {
                            dispatch(setGenre({}));
                            navigate("/");
                        }}
                    >
                        <img
                            src="/logo.jpg"
                            alt="Blue sky book"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <Search
                        placeholder="Search book"
                        onSearch={onSearch}
                        enterButton="Search"
                        size="large"
                    />
                </div>
                <div>
                    <Popover
                        placement="bottomRight"
                        title="Cart Items"
                        content={cartPopoverContent}
                        trigger="hover"
                    >
                        <Button
                            type="link"
                            icon={
                                <Badge count={cartItems.length}>
                                    <ShoppingCartOutlined />
                                </Badge>
                            }
                            onClick={() => navigate("/checkout")}
                        >
                            My Cart
                        </Button>
                    </Popover>
                    <Button
                        type="link"
                        icon={<UserOutlined />}
                        onClick={() => navigate("/customer/account/")}
                    >
                        Account
                    </Button>
                </div>
            </Header>
        </Layout>
    );
};

export default DashboardTopBar;
