import { Button, Form, FormProps, Input, Typography } from "antd";
import LayoutAuthentication from "../layouts/LayoutAuthentication";
import { BLUE_STORE_BOOK_API } from "../apis";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type FieldType = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            setLoading(true);
            const { email, password } = values;
            const response = await BLUE_STORE_BOOK_API.AUTH.login(
                email,
                password
            );
            if (response.status === 200) {
                navigate("/");
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
    };
    return (
        <LayoutAuthentication>
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
                className="bg-lite w-full max-w-[400px] p-4 rounded-lg shadow-md mx-auto"
            >
                <Typography.Title
                    level={3}
                    style={{
                        textAlign: "center",
                    }}
                >
                    Sign in
                </Typography.Title>
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Email is required",
                        },
                        {
                            type: "email",
                            message: "Invalid email",
                        },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Password is required",
                        },
                        {
                            min: 8,
                            message: "Password must be at least 8 characters",
                        },
                    ]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        iconPosition={"end"}
                    >
                        Login
                    </Button>
                </Form.Item>
                <Typography.Paragraph
                    style={{
                        textAlign: "center",
                    }}
                >
                    Don't have an account?
                    <Button type="link" href="/signup">
                        Sign up now
                    </Button>
                </Typography.Paragraph>
            </Form>
        </LayoutAuthentication>
    );
};

export default LoginPage;
