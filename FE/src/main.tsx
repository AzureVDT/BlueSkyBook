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

// const DashboardPage = () =>
//     React.lazy(() => import("./pages/DashboardPage.tsx"));
// const NotFoundPage = () => React.lazy(() => import("./pages/NotFoundPage.tsx"));
// const LoginPage = () => React.lazy(() => import("./pages/LoginPage.tsx"));
// const SignUpPage = () => React.lazy(() => import("./pages/SignUpPage.tsx"));

const router = createBrowserRouter([
    {
        element: <LayoutDashboard />,
        children: [
            {
                path: "/",
                element: <DashboardPage />,
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
        <App>
            <Suspense fallback={<Loading />}>
                <RouterProvider router={router} />
            </Suspense>
        </App>
        <ToastContainer bodyClassName="font-primary text-sm"></ToastContainer>
    </React.StrictMode>
);
