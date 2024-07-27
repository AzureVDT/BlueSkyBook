import { createSlice } from "@reduxjs/toolkit";
import { Genre } from "../../types/genreType";

type CommonType = {
    triggerFetchingCart: boolean;
    searchValue: string;
    genres: Genre[];
};

const initialState: CommonType = {
    triggerFetchingCart: false,
    searchValue: "",
    genres: [],
};

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setTriggerFetchingCart: (state, action) => {
            state.triggerFetchingCart = action.payload;
        },
        setSearchValue: (state, action) => {
            state.searchValue = action.payload;
        },
        setGenres: (state, action) => {
            state.genres = action.payload;
        },
    },
});

export const { setTriggerFetchingCart, setSearchValue, setGenres } =
    commonSlice.actions;
export default commonSlice.reducer;
