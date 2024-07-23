import { createSlice } from "@reduxjs/toolkit";
import { LoginResponse } from "../../types/customerType";

type AuthType = {
    userInfo: LoginResponse;
};

const initialState: AuthType = {
    userInfo: {} as LoginResponse,
};

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
    },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
