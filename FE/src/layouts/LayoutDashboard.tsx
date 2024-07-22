import { Outlet } from "react-router-dom";
import DashboardTopBar from "../modules/dashboard/DashboardTopBar";

const LayoutDashboard = () => {
    return (
        <div className="h-full md:min-h-screen min-w-fit bg-strock">
            <div className="w-full h-[60px] mx-auto shadow-md bg-lite fixed top-0 left-0 right-0">
                <DashboardTopBar />
            </div>
            <div className="z-50 mt-[60px] fixed">
                <div className="flex items-start justify-start"></div>
            </div>
            <div className="w-full h-full pt-[60px]">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default LayoutDashboard;
