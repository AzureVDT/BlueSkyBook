import { createSlice } from "@reduxjs/toolkit";

type CommonType = {
    triggerFetchingCart: boolean;
};

const initialState: CommonType = {
    triggerFetchingCart: false,
};

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setTriggerFetchingCart: (state, action) => {
            state.triggerFetchingCart = action.payload;
        },
    },
});

export const { setTriggerFetchingCart } = commonSlice.actions;
export default commonSlice.reducer;
