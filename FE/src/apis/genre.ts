import { AxiosResponse } from "axios";
import axios from "./axios";
import { Genre } from "../types/genreType";

const getAllGenres = async () => {
    const response: AxiosResponse<Genre[]> = await axios.get("/genre");
    return response.data;
};

const getGenreById = async (id: number) => {
    const response: AxiosResponse<Genre> = await axios.get(`/genre/${id}`);
    return response.data;
};

export const GENRE = {
    getAllGenres,
    getGenreById,
};
