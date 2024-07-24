import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BLUE_STORE_BOOK_API } from "../apis";
import { Book } from "../types/bookTypes";
import {
    Card,
    Row,
    Col,
    Rate,
    Typography,
    Tag,
    InputNumber,
    Button,
    message,
} from "antd";
import Loading from "../components/common/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setGenre } from "../store/actions/bookSlice";
import { setTriggerFetchingCart } from "../store/actions/commonSlice";
import { RootState } from "../store/configureStore";

const { Title, Paragraph } = Typography;

const BookDetailPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book>({} as Book);
    const [quantity, setQuantity] = useState<number>(1);
    const triggerFetchingCart = useSelector(
        (state: RootState) => state.common.triggerFetchingCart
    );

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await BLUE_STORE_BOOK_API.BOOK.getBookById(
                    Number(id)
                );
                if (response.status === 200) {
                    setBook(response.data);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch book detail. Please try again later."
                );
            }
        }
        fetchData();
    }, [id]);

    const handleAddToCart = () => {
        const cartItems = JSON.parse(
            sessionStorage.getItem("cartItems") || "[]"
        );
        const existingItemIndex = cartItems.findIndex(
            (item: { bookId: number }) => item.bookId === book.id
        );

        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            cartItems.push({
                bookId: book.id,
                quantity,
                name: book.bookname,
                price: book.price,
                thumbnail: book.thumbnail,
                availableQuantity: book.availableQuantity,
            });
        }
        dispatch(setTriggerFetchingCart(!triggerFetchingCart));
        sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
        message.success("Book added to cart!");
    };

    return (
        <div className="p-6">
            {book.id ? (
                <Card>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}>
                            <img
                                src={book.thumbnail}
                                alt={book.bookname}
                                style={{ width: "100%" }}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={16}>
                            <Title level={2}>{book.bookname}</Title>
                            <Rate disabled defaultValue={book.rating} />
                            <Paragraph type="secondary">
                                Price:{" "}
                                <strong className="text-tertiary">
                                    ${book.price}
                                </strong>
                            </Paragraph>
                            <Paragraph type="secondary">
                                Available Quantity: {book.availableQuantity}
                            </Paragraph>
                            <Paragraph type="secondary">
                                Genre:{" "}
                                <Tag
                                    color="blue"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        navigate("/");
                                        dispatch(setGenre(book.genre));
                                    }}
                                >
                                    {book.genre.name}
                                </Tag>
                            </Paragraph>
                            <Paragraph>{book.description}</Paragraph>
                            <Row
                                gutter={[16, 16]}
                                align={"middle"}
                                justify={"center"}
                            >
                                <Col span={24}>
                                    <InputNumber
                                        min={1}
                                        max={book.availableQuantity}
                                        defaultValue={1}
                                        onChange={(value) =>
                                            setQuantity(value || 1)
                                        }
                                        className="w-full max-w-[200px]"
                                    />
                                </Col>
                                <Col span={24}>
                                    <Button
                                        type="primary"
                                        onClick={handleAddToCart}
                                        className="w-full max-w-[200px]"
                                    >
                                        Add to Cart
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default BookDetailPage;
