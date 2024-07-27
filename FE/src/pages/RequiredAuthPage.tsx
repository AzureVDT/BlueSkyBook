import { useEffect } from "react";
import getUserInfoFromCookie from "../utils/getUserInfoFromCookie";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const RequiredAuthPage = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const decryptUser = getUserInfoFromCookie();
        if (!decryptUser) {
            message.error("Please login to access this page.");
            navigate("/login");
        }
    }, [navigate]);
    return <>{children}</>;
};

export default RequiredAuthPage;
