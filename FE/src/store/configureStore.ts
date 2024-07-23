import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./actions/authSlice";

const reducer = combineReducers({
    auth: authSlice,
});

const store = configureStore({
    reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
