import { Tabs } from "antd";
import UpdateProfile from "../modules/profile/UpdateProfile";
import ChangePassword from "../modules/profile/ChangePassword";
import RequiredAuthPage from "./RequiredAuthPage";

const ProfilePage = () => {
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
    ];
    return (
        <RequiredAuthPage>
            <div className="w-full h-full p-4 bg-lite ml-">
                <Tabs tabPosition={"left"} items={tabs} />
            </div>
        </RequiredAuthPage>
    );
};

export default ProfilePage;
