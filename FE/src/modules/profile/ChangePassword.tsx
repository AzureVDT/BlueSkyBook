import {
    Button,
    Col,
    Form,
    FormProps,
    Input,
    message,
    Row,
    Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { BLUE_STORE_BOOK_API } from "../../apis";
import { setUserInfo } from "../../store/actions/authSlice";
import saveUserInfoToCookie from "../../utils/saveUserInfoToCookie";

type FieldType = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};
const ChangePassword = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    console.log("ChangePassword ~ userInfo:", userInfo);
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        console.log("Success:", values);
        if (values.currentPassword !== userInfo.password) {
            form.setFields([
                {
                    name: "currentPassword",
                    errors: ["Current password is incorrect"],
                },
            ]);
        } else {
            const response = await BLUE_STORE_BOOK_API.AUTH.updatePassword(
                values.newPassword,
                userInfo.id
            );
            if (response.status === 200) {
                dispatch(
                    setUserInfo({
                        ...userInfo,
                        password: values.newPassword,
                    })
                );
                saveUserInfoToCookie({
                    ...userInfo,
                    password: values.newPassword,
                });
                form.resetFields();
                message.success("Update password successfully!");
            }
        }
    };
    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
    };
    return (
        <Form
            form={form}
            name="reset-password"
            layout="vertical"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Typography.Title
                level={4}
                style={{
                    textAlign: "center",
                }}
            >
                Change password
            </Typography.Title>
            <Row>
                <Col span={12} offset={6}>
                    <Form.Item<FieldType>
                        label={"Current password"}
                        name="currentPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please input your current password!",
                            },
                            {
                                min: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Col span={12} offset={6}>
                    <Form.Item<FieldType>
                        label={"New password"}
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new password!",
                            },
                            {
                                min: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Col span={12} offset={6}>
                    <Form.Item<FieldType>
                        label={"Confirm password"}
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            {
                                required: true,
                                message: "Please input your confirm password!",
                            },
                            {
                                min: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newPassword") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "The two passwords that you entered do not match!"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={8} offset={6}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default ChangePassword;
