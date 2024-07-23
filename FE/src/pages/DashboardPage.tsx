import { useEffect, useState } from "react";
import { BLUE_STORE_BOOK_API } from "../apis";
import { Layout, Pagination } from "antd";
import { Book } from "../types/bookTypes";
import { Content, Footer, Header } from "antd/es/layout/layout";

const DashboardPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    useEffect(() => {
        async function fetchData() {
            const response = await BLUE_STORE_BOOK_API.BOOK.getAllBooks();
            if (response.status === 200) {
                setBooks(response.data);
            }
        }
        fetchData();
    }, []);
    return (
        <Layout>
            <Header className="bg-lite">
                <div className="text-2xl font-bold text-center">Books</div>
            </Header>
            <Content>
                <div className="grid grid-cols-4 gap-4 p-4">
                    {books.map((book) => (
                        <div key={book.id} className="p-4 bg-white shadow-md">
                            <img
                                className="object-cover w-full h-48"
                                src={book.thumbnail}
                                alt={book.bookname}
                            />
                            <div className="mt-2 text-lg font-bold">
                                {book.bookname}
                            </div>
                        </div>
                    ))}
                </div>
            </Content>
            <Footer>
                <Pagination defaultCurrent={1} total={books.length} />
            </Footer>
        </Layout>
    );
};

export default DashboardPage;
