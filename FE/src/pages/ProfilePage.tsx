import { Tabs } from "antd";
import UpdateProfile from "../modules/profile/UpdateProfile";
import ChangePassword from "../modules/profile/ChangePassword";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../utils/auth";

const ProfilePage = () => {
    const navigate = useNavigate();
    const tabs = [
        {
            key: "1",
            label: "Information",
            children: <UpdateProfile />,
        },
        {
            key: "2",
            label: "Change password",
            children: <ChangePassword />,
        },
        {
            key: "3",
            label: "Logout",
        },
    ];
    const onTabClick = (key: string) => {
        if (key === "3") {
            saveUser("");
            navigate("/login");
        }
    };
    return (
        <div className="w-full h-full p-4 bg-lite ml-">
            <Tabs tabPosition={"left"} items={tabs} onTabClick={onTabClick} />
        </div>
    );
};

export default ProfilePage;
