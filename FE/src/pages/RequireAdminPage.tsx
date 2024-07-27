import { useSelector } from "react-redux";
import RequiredAuthPage from "./RequiredAuthPage";
import { RootState } from "../store/configureStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const RequireAdminPage = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    useEffect(() => {
        if (userInfo.role !== "ADMIN") {
            message.error("You are not authorized to access this page.");
            navigate("/");
        }
    }, [navigate, userInfo]);
    return <RequiredAuthPage>{children}</RequiredAuthPage>;
};

export default RequireAdminPage;
