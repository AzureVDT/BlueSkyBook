import {
    Badge,
    Button,
    Layout,
    List,
    Modal,
    Popover,
    Typography,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    UploadFile,
    message,
} from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import { Header } from "antd/es/layout/layout";
import {
    ShoppingCartOutlined,
    UserOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGenre } from "../../store/actions/bookSlice";
import { useEffect, useState } from "react";
import { RootState } from "../../store/configureStore";
import { setSearchValue } from "../../store/actions/commonSlice";
import handleUpdateImageToImgbb from "../../utils/handleUploadImageToImgbb";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { BLUE_STORE_BOOK_API } from "../../apis";
import { BookBody } from "../../types/bookTypes";
import { CartItem } from "../../types/commonType";
import { saveUser } from "../../utils/auth";
const { Option } = Select;

const DashboardTopBar = () => {
    const navigate = useNavigate();
    const triggerFetchingCart = useSelector(
        (state: RootState) => state.common.triggerFetchingCart
    );
    const genres = useSelector((state: RootState) => state.common.genres);
    const onSearch: SearchProps["onSearch"] = (value) =>
        dispatch(setSearchValue(value));
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState<CartItem[]>(
        JSON.parse(sessionStorage.getItem("cartItems") || "[]")
    );

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);

    useEffect(() => {
        setCartItems(JSON.parse(sessionStorage.getItem("cartItems") || "[]"));
    }, [triggerFetchingCart]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setPreviewImage(null);
        setFileList([]);
    };

    const handleAddBook = async (values: {
        bookname: string;
        description: string;
        rating: number;
        price: number;
        availableQuantity: number;
        genre: number;
    }) => {
        try {
            if (fileList.length === 0 || !fileList[0].originFileObj) {
                throw new Error("Thumbnail file is missing");
            }
            const formData = new FormData();
            formData.append("image", fileList[0].originFileObj as RcFile);
            const thumbnailUrl = await handleUpdateImageToImgbb(formData);
            const selectedGenre = genres.find(
                (genre) => genre.id === values.genre
            );
            const bookData: BookBody = {
                bookname: values.bookname,
                description: values.description,
                thumbnail: thumbnailUrl,
                rating: values.rating,
                price: values.price,
                availableQuantity: values.availableQuantity,
                available: true,
                genre: {
                    id: selectedGenre?.id || 0,
                    name: selectedGenre?.name || "",
                },
            };
            const response = await BLUE_STORE_BOOK_API.BOOK.addBook(bookData);
            if (response.status === 200) {
                setIsModalVisible(false);
                form.resetFields();
                setPreviewImage(null);
                setFileList([]);
                message.success("Book added successfully");
                dispatch(setGenre({}));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePreview = (file: RcFile) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
        const fileList = info.fileList.slice(-1); // Limit to only one file
        setFileList(fileList);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            handlePreview(fileList[0].originFileObj as RcFile);
        } else {
            setPreviewImage(null);
        }
    };

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
            <Button
                type="primary"
                block
                onClick={() => {
                    if (userInfo.id) {
                        navigate("/checkout");
                    } else {
                        message.error("Please login to view cart");
                    }
                }}
            >
                View Cart
            </Button>
        </div>
    );

    const handleLogout = async () => {
        const response = await BLUE_STORE_BOOK_API.CART.saveCart(
            JSON.parse(sessionStorage.getItem("cartItems") || "[]"),
            userInfo.id
        );
        if (response.status === 200) {
            sessionStorage.removeItem("cartItems");
            saveUser("");
            navigate("/login");
        }
    };

    const accountPopoverContent = (
        <div>
            <Button
                type="link"
                onClick={() => navigate("/customer/account")}
                block
            >
                Profile
            </Button>
            <Button type="link" onClick={handleLogout} block>
                Logout
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
                    {userInfo.role === "ADMIN" && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showModal}
                        >
                            Add Book
                        </Button>
                    )}
                    {userInfo.role === "CUSTOMER" && (
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
                    )}
                    {userInfo.role === "ADMIN" && (
                        <>
                            <Button
                                type="link"
                                onClick={() => navigate("/admin/orders")}
                            >
                                View Orders
                            </Button>
                            <Button
                                type="link"
                                onClick={() => navigate("/admin/customers")}
                            >
                                View Customer
                            </Button>
                        </>
                    )}
                    {userInfo.id ? (
                        <Popover
                            placement="bottomRight"
                            trigger={"hover"}
                            content={accountPopoverContent}
                        >
                            <Button
                                type="link"
                                icon={<UserOutlined />}
                                onClick={() => navigate("/customer/account/")}
                            >
                                Account
                            </Button>
                        </Popover>
                    ) : (
                        <Button type="link" href="/login">
                            Login
                        </Button>
                    )}
                </div>
            </Header>

            <Modal
                title="Add Book"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            handleAddBook(values);
                        })
                        .catch((info) => {
                            console.log("Validate Failed:", info);
                        });
                }}
            >
                <Form form={form} layout="vertical" name="addBookForm">
                    <Form.Item
                        name="bookname"
                        label="Book Name"
                        rules={[
                            {
                                required: true,
                                message: "Please input the book name!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: "Please input the description!",
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="thumbnail"
                        label="Thumbnail"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e.fileList
                        }
                        rules={[
                            {
                                required: true,
                                message: "Please upload a thumbnail!",
                            },
                        ]}
                    >
                        <Upload
                            listType="picture-card"
                            multiple={false}
                            beforeUpload={() => false}
                            onChange={handleUploadChange}
                        >
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="thumbnail"
                                    style={{ width: "100%" }}
                                />
                            ) : (
                                "Upload"
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="rating"
                        label="Rating"
                        rules={[
                            {
                                required: true,
                                message: "Please input the rating!",
                            },
                        ]}
                    >
                        <InputNumber min={1} max={5} />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            {
                                required: true,
                                message: "Please input the price!",
                            },
                        ]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        name="availableQuantity"
                        label="Available Quantity"
                        rules={[
                            {
                                required: true,
                                message: "Please input the available quantity!",
                            },
                        ]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        name="genre"
                        label="Genre"
                        rules={[
                            {
                                required: true,
                                message: "Please select a genre!",
                            },
                        ]}
                    >
                        <Select placeholder="Select a genre">
                            {genres.map((genre) => (
                                <Option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default DashboardTopBar;
