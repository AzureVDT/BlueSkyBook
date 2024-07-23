import { Genre } from "./genreType";

type Book = {
    id: number;
    bookname: string;
    description: string;
    thumbnail: string;
    rating: number;
    price: number;
    availableQuantity: number;
    genre: Genre;
    available: boolean;
};

export type { Book };
