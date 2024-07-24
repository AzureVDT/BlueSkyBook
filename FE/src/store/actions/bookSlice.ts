import { createSlice } from "@reduxjs/toolkit";
import { Genre } from "../../types/genreType";

type BookType = {
    genre: Genre;
};

const initialState: BookType = {
    genre: {} as Genre,
};

const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        setGenre: (state, action) => {
            state.genre = action.payload;
        },
    },
});

export const { setGenre } = bookSlice.actions;
export default bookSlice.reducer;
