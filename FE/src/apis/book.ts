import { AxiosResponse } from "axios";
import axios from "./axios";
import { Book } from "../types/bookTypes";

const getAllBooks = async () => {
    const response: AxiosResponse<Book[]> = await axios.get("/book");
    return response;
};

const getBookById = async (id: number) => {
    const response: AxiosResponse<Book> = await axios.get(`/book/${id}`);
    return response;
};

const getBookByGenre = async (genre: number) => {
    const response: AxiosResponse<Book[]> = await axios.get(
        `/book/genre/${genre}`
    );
    return response;
};

const addBook = async (book: Book) => {
    const response: AxiosResponse<Book> = await axios.post(
        "/book/create",
        book
    );
    return response;
};

const updateBookQuantity = async (id: number, quantity: number) => {
    const response: AxiosResponse<Book> = await axios.put(
        `/book/${id}/update`,
        {
            availableQuantity: quantity,
        }
    );
    return response;
};

const deleteBook = async (id: number) => {
    const response: AxiosResponse<Book> = await axios.delete(
        `/book/${id}/delete`
    );
    return response;
};

export const BOOK = {
    getAllBooks,
    getBookById,
    getBookByGenre,
    addBook,
    updateBookQuantity,
    deleteBook,
};
