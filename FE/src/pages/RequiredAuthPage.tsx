import { useEffect } from "react";
import getUserInfoFromCookie from "../utils/getUserInfoFromCookie";
import { useNavigate } from "react-router-dom";

const RequiredAuthPage = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const decryptUser = getUserInfoFromCookie();
        if (!decryptUser) {
            navigate("/login");
        }
    }, [navigate]);
    return <>{children}</>;
};

export default RequiredAuthPage;
