import { useEffect, useState } from "react";
import { BLUE_STORE_BOOK_API } from "../apis"; // Assuming this API handles cart operations
import {
    Layout,
    Pagination,
    Image,
    Card,
    Button,
    message,
    Row,
    Col,
    Typography,
    InputNumber,
} from "antd";
import { Book } from "../types/bookTypes";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import { setTriggerFetchingCart } from "../store/actions/commonSlice";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 20;

const DashboardPage = () => {
    const triggerFetchingCart = useSelector(
        (state: RootState) => state.common.triggerFetchingCart
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [books, setBooks] = useState<Book[]>([]);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const genre = useSelector((state: RootState) => state.book.genre);
    const [cartItems, setCartItems] = useState<
        {
            bookId: number;
            quantity: number;
            name: string;
            price: number;
            thumbnail: string;
        }[]
    >(JSON.parse(sessionStorage.getItem("cartItems") || "[]"));

    useEffect(() => {
        async function fetchData() {
            try {
                if (genre.id) {
                    const response =
                        await BLUE_STORE_BOOK_API.BOOK.getBookByGenre(genre.id);
                    if (response.status === 200) {
                        setAllBooks(response.data);
                    }
                } else {
                    const response =
                        await BLUE_STORE_BOOK_API.BOOK.getAllBooks();
                    if (response.status === 200) {
                        setAllBooks(response.data);
                    }
                }
            } catch (error) {
                message.error("Failed to fetch books. Please try again later.");
            }
        }
        fetchData();
    }, [genre]);

    useEffect(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        setBooks(allBooks.slice(start, end));
    }, [currentPage, allBooks]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleAddToCart = async (book: Book) => {
        try {
            let carts = [...cartItems];
            const quantity = quantities[book.id] || 1;
            const existingItemIndex = carts.findIndex(
                (item) => item.bookId === book.id
            );

            if (existingItemIndex !== -1) {
                const updatedCartItems = [...cartItems];
                updatedCartItems[existingItemIndex].quantity += quantity;
                carts = updatedCartItems;
                setCartItems(updatedCartItems);
            } else {
                const newCartItems = [
                    ...cartItems,
                    {
                        bookId: book.id,
                        quantity,
                        name: book.bookname,
                        price: book.price,
                        thumbnail: book.thumbnail,
                    },
                ];
                carts = newCartItems;
                setCartItems(newCartItems);
            }
            sessionStorage.setItem("cartItems", JSON.stringify(carts));
            dispatch(setTriggerFetchingCart(!triggerFetchingCart));
            message.success("Book added to cart!");
        } catch (error) {
            message.error("Failed to add book to cart. Please try again.");
        }
    };

    const handleQuantityChange = (bookId: number, value: number) => {
        setQuantities({ ...quantities, [bookId]: value });
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header className="py-2 bg-lite">
                <Typography.Title level={3}>
                    All {genre.id ? genre.name : ""} Books: page {currentPage}
                </Typography.Title>
            </Header>
            <Content style={{ padding: "20px" }}>
                <Row gutter={[16, 16]}>
                    {books.map((book) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                            <Card
                                className="shadow-md"
                                cover={
                                    <div className="w-full h-[250px]">
                                        <Image
                                            className="object-cover w-full h-full"
                                            width={"100%"}
                                            height={250}
                                            src={book.thumbnail}
                                            alt={book.bookname}
                                        />
                                    </div>
                                }
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography.Title
                                    className="cursor-pointer hover:underline line-clamp-1 hover:text-tertiary"
                                    level={5}
                                    onClick={() => navigate(`/book/${book.id}`)}
                                >
                                    {book.bookname}
                                </Typography.Title>
                                <div className="mt-2">
                                    <span className="font-semibold">
                                        Price:
                                    </span>{" "}
                                    ${book.price}
                                </div>
                                {book.availableQuantity > 0 ? (
                                    <div className="text-green-500">
                                        In Stock
                                    </div>
                                ) : (
                                    <div className="text-red-500">
                                        Out of Stock
                                    </div>
                                )}
                                <div className="mt-4">
                                    <InputNumber
                                        min={1}
                                        max={book.availableQuantity}
                                        defaultValue={1}
                                        onChange={(value) =>
                                            handleQuantityChange(
                                                book.id,
                                                value || 0
                                            )
                                        }
                                        style={{ width: "100%" }}
                                    />
                                </div>
                                <div className="mt-2">
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={() => handleAddToCart(book)}
                                        style={{ width: "100%" }}
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>
            <Footer className="py-4 text-center">
                <Pagination
                    current={currentPage}
                    total={allBooks.length}
                    pageSize={PAGE_SIZE}
                    onChange={handlePageChange}
                />
            </Footer>
        </Layout>
    );
};

export default DashboardPage;
