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
    Popover,
    Rate,
} from "antd";
import { Book } from "../types/bookTypes";
import { Content, Footer, Header } from "antd/es/layout/layout";
import {
    DeleteOutlined,
    PlusCircleOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import { setTriggerFetchingCart } from "../store/actions/commonSlice";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../types/commonType";

const PAGE_SIZE = 20;

const DashboardPage = () => {
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const triggerFetchingCart = useSelector(
        (state: RootState) => state.common.triggerFetchingCart
    );
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [books, setBooks] = useState<Book[]>([]);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const genre = useSelector((state: RootState) => state.book.genre);
    const [cartItems, setCartItems] = useState<CartItem[]>(
        JSON.parse(sessionStorage.getItem("cartItems") || "[]")
    );

    const searchValue = useSelector(
        (state: RootState) => state.common.searchValue
    );

    useEffect(() => {
        if (searchValue) {
            const filteredBooks = allBooks.filter((book) =>
                book.bookname.toLowerCase().includes(searchValue.toLowerCase())
            );
            setBooks(filteredBooks);
        }
    }, [allBooks, searchValue]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (genre.id) {
                    const response =
                        await BLUE_STORE_BOOK_API.BOOK.getBookByGenre(genre.id);
                    if (response.status === 200) {
                        const books = response.data.filter(
                            (book) => book.available === true
                        );
                        setAllBooks(books);
                    }
                } else {
                    const response =
                        await BLUE_STORE_BOOK_API.BOOK.getAllBooks();
                    if (response.status === 200) {
                        const books = response.data.filter(
                            (book) => book.available === true
                        );
                        setAllBooks(books);
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
            if (userInfo.id) {
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
                            availableQuantity: book.availableQuantity,
                        },
                    ];
                    carts = newCartItems;
                    setCartItems(newCartItems);
                }
                sessionStorage.setItem("cartItems", JSON.stringify(carts));
                dispatch(setTriggerFetchingCart(!triggerFetchingCart));
                message.success("Book added to cart!");
            } else {
                message.error("Please login to add book to cart.");
            }
        } catch (error) {
            message.error("Failed to add book to cart. Please try again.");
        }
    };

    const handleDeleteBook = async (bookId: number) => {
        try {
            const response = await BLUE_STORE_BOOK_API.BOOK.deleteBook(bookId);
            if (response.status === 204) {
                const updatedBooks = allBooks.filter(
                    (book) => book.id !== bookId
                );
                setAllBooks(updatedBooks);
                message.success("Book deleted successfully!");
            }
        } catch (error) {
            message.error("Failed to delete book. Please try again later.");
        }
    };

    const handleUpdateQuantity = async (bookId: number, quantity: number) => {
        try {
            const response = await BLUE_STORE_BOOK_API.BOOK.updateBookQuantity(
                bookId,
                quantity
            );
            if (response.status === 200) {
                const updatedBooks = allBooks.map((book) => {
                    if (book.id === bookId) {
                        return { ...book, availableQuantity: quantity };
                    }
                    return book;
                });
                setAllBooks(updatedBooks);
                message.success("Quantity updated successfully!");
            }
        } catch (error) {
            message.error("Failed to update quantity. Please try again later.");
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
                                <Rate disabled defaultValue={book.rating} />
                                <Typography.Text>
                                    Available quantity:{" "}
                                    <strong>{book.availableQuantity}</strong>
                                </Typography.Text>
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
                                <div className="flex flex-col mt-2 gap-y-2">
                                    {userInfo.role !== "ADMIN" && (
                                        <Button
                                            type="primary"
                                            icon={<ShoppingCartOutlined />}
                                            onClick={() =>
                                                handleAddToCart(book)
                                            }
                                            style={{ width: "100%" }}
                                            disabled={
                                                book.availableQuantity === 0
                                            }
                                        >
                                            Add to Cart
                                        </Button>
                                    )}
                                    {userInfo.role === "ADMIN" && (
                                        <>
                                            <Popover
                                                placement="bottomRight"
                                                title="Cart Items"
                                                content={
                                                    <>
                                                        <div className="flex items-center justify-between">
                                                            <span>
                                                                {book.bookname}
                                                            </span>
                                                            <InputNumber
                                                                min={1}
                                                                defaultValue={1}
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    setQuantity(
                                                                        value as number
                                                                    )
                                                                }
                                                                style={{
                                                                    width: "50%",
                                                                }}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        book.id,
                                                                        quantity
                                                                    )
                                                                }
                                                            >
                                                                Update
                                                            </Button>
                                                        </div>
                                                    </>
                                                }
                                                trigger="click"
                                            >
                                                <Button
                                                    icon={
                                                        <PlusCircleOutlined />
                                                    }
                                                >
                                                    Update Quantity
                                                </Button>
                                            </Popover>
                                            <Button
                                                danger
                                                type="primary"
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                    handleDeleteBook(book.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
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
