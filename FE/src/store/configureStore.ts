import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./actions/authSlice";
import bookSlice from "./actions/bookSlice";
import commonSlice from "./actions/commonSlice";

const reducer = combineReducers({
    auth: authSlice,
    book: bookSlice,
    common: commonSlice,
});

const store = configureStore({
    reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
