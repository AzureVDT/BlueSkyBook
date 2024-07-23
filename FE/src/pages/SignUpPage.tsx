import { Button, Form, FormProps, Input, Typography } from "antd";
import LayoutAuthentication from "../layouts/LayoutAuthentication";
import { BLUE_STORE_BOOK_API } from "../apis";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import getUserInfoFromCookie from "../utils/getUserInfoFromCookie";
import saveUserInfoToCookie from "../utils/saveUserInfoToCookie";
import { toast } from "react-toastify";

type FieldType = {
    name: string;
    email: string;
    password: string;
};
const SignUpPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            setLoading(true);
            const { name, email, password } = values;
            const response = await BLUE_STORE_BOOK_API.AUTH.signup(
                name,
                email,
                password
            );
            if (response.status === 200) {
                saveUserInfoToCookie(response.data);
                toast.success("Sign up successfully!");
                navigate("/profile");
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
    useEffect(() => {
        const decryptUser = getUserInfoFromCookie();
        if (decryptUser) {
            navigate("/");
        }
    }, [navigate]);
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
                    Sign up
                </Typography.Title>
                <Form.Item<FieldType>
                    label="Full name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Full name is required",
                        },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
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
                        iconPosition="end"
                    >
                        Sign up
                    </Button>
                </Form.Item>
                <Typography.Paragraph
                    style={{
                        textAlign: "center",
                    }}
                >
                    Already have an account?
                    <Button type="link" href="/login">
                        Sign in now
                    </Button>
                </Typography.Paragraph>
            </Form>
        </LayoutAuthentication>
    );
};

export default SignUpPage;
