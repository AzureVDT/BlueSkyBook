/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutDashboard from "./layouts/LayoutDashboard.tsx";
import Loading from "./components/common/Loading.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import { Provider } from "react-redux";
import store from "./store/configureStore.ts";

const router = createBrowserRouter([
    {
        element: <LayoutDashboard />,
        children: [
            {
                path: "/",
                element: <DashboardPage />,
            },
            {
                path: "/customer/account",
                element: <ProfilePage />,
            },
        ],
    },
    {
        element: <LoginPage />,
        path: "/login",
    },
    {
        element: <SignUpPage />,
        path: "/signup",
    },
    { path: "*", element: <NotFoundPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App>
                <Suspense fallback={<Loading />}>
                    <RouterProvider router={router} />
                </Suspense>
            </App>
        </Provider>
        <ToastContainer bodyClassName="font-primary text-sm"></ToastContainer>
    </React.StrictMode>
);
