import { Button, Layout } from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import { Header } from "antd/es/layout/layout";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const DashboardTopBar = () => {
    const navigate = useNavigate();
    const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
        console.log(info?.source, value);
    return (
        <Layout>
            <Header className="flex items-center justify-between bg-lite w-full h-[64px]">
                <div className="flex items-center justify-center h-full gap-x-5">
                    <div
                        className="w-[200px] h-full cursor-pointer"
                        onClick={() => navigate("/")}
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
                    <Button
                        type="link"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => navigate("/checkout/cart/")}
                    >
                        My Cart
                    </Button>
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
