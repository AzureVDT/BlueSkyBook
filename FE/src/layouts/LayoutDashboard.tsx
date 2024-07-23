import { Outlet } from "react-router-dom";
import DashboardTopBar from "../modules/dashboard/DashboardTopBar";
import DashboardSideBar from "../modules/dashboard/DashboardSideBar";
import { Col, Row } from "antd";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import getUserInfoFromCookie from "../utils/getUserInfoFromCookie";
import { setUserInfo } from "../store/actions/authSlice";
import RequiredAuthPage from "../pages/RequiredAuthPage";

const LayoutDashboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const user = getUserInfoFromCookie();
        if (user) {
            dispatch(setUserInfo(user));
        }
    }, [dispatch]);

    return (
        <RequiredAuthPage>
            <div className="h-full md:min-h-screen min-w-fit bg-strock">
                <Row className="w-full h-[60px] shadow-md bg-lite fixed top-0 left-0 right-0 z-50">
                    <Col span={24}>
                        <DashboardTopBar></DashboardTopBar>
                    </Col>
                </Row>
                <div className="pt-[64px]">
                    <DashboardSideBar></DashboardSideBar>
                    <Row className="mt-10">
                        <Col span={16} offset={6}>
                            <Outlet></Outlet>
                        </Col>
                    </Row>
                </div>
            </div>
        </RequiredAuthPage>
    );
};

export default LayoutDashboard;
