import { UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Form,
    FormProps,
    Input,
    message,
    Row,
    Typography,
    UploadFile,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Upload, { RcFile, UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import handleUpdateImageToImgbb from "../../utils/handleUploadImageToImgbb";
import { BLUE_STORE_BOOK_API } from "../../apis";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import saveUserInfoToCookie from "../../utils/saveUserInfoToCookie";
import { setUserInfo } from "../../store/actions/authSlice";

type FieldType = {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    address: string;
};
const UpdateProfile = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    console.log("UpdateProfile ~ userInfo:", userInfo);
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        if (fileList.length > 0 && fileList[0].originFileObj) {
            try {
                setLoading(true);
                const formdata = new FormData();
                formdata.append("image", fileList[0].originFileObj as RcFile);
                const imageUrl = await handleUpdateImageToImgbb(formdata);
                const updatedValues = { ...values, avatar: imageUrl };
                const response = await BLUE_STORE_BOOK_API.AUTH.updateProfile(
                    updatedValues,
                    userInfo.id
                );
                if (response.status === 200) {
                    dispatch(setUserInfo(response.data));
                    saveUserInfoToCookie(response.data);
                    message.success("Update profile successfully!");
                }
            } catch (error) {
                console.error("Image upload error:", error);
            }
        } else {
            message.error("Please upload an avatar image.");
        }
    };
    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
    };
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    console.log("UpdateProfile ~ fileList:", fileList);
    const [previewImage, setPreviewImage] = useState<string>("");

    const beforeUpload = (file: RcFile): boolean => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
            return false;
        }
        return true;
    };

    const handleChange = (info: UploadChangeParam<UploadFile>): void => {
        setFileList(info.fileList);
        if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(info.fileList[0].originFileObj as RcFile);
        } else {
            setPreviewImage("");
        }
    };
    useEffect(() => {
        form.setFieldsValue({
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone,
            avatar: userInfo.avatar,
            address: userInfo.address,
        });
        setPreviewImage(userInfo.avatar);
    }, [
        form,
        userInfo.address,
        userInfo.avatar,
        userInfo.email,
        userInfo.name,
        userInfo.phone,
    ]);
    if (!userInfo) return null;
    return (
        <Form
            form={form}
            name="information"
            layout="vertical"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 24 }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Row>
                <Col span={8}>
                    <Typography.Title level={4}>
                        Update Information
                    </Typography.Title>
                </Col>
                <Col
                    span={8}
                    offset={8}
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update
                    </Button>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col xs={24} xl={8} md={16}>
                    <Form.Item<FieldType>
                        label={"name"}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your name!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={8} md={16}>
                    <Form.Item<FieldType>
                        label={"Email"}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email!",
                            },
                            {
                                type: "email",
                                message: "The input is not valid E-mail!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={8} md={16}>
                    <Form.Item<FieldType>
                        label={"Phone"}
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please input your phone number!",
                            },
                            {
                                pattern: /^0\d{9}$/,
                                message: "The input is not valid phone number!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} xl={8} md={16}>
                    <Form.Item<FieldType>
                        label={"Avatar"}
                        name="avatar"
                        rules={[
                            {
                                required: true,
                                message: "Please upload your avatar!",
                            },
                        ]}
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="avatar"
                                    style={{ width: "100%" }}
                                />
                            ) : (
                                <UploadOutlined />
                            )}
                        </Upload>
                    </Form.Item>
                </Col>

                <Col xs={24} xl={16} md={16}>
                    <Form.Item<FieldType>
                        label={"Address"}
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Please input your address!",
                            },
                        ]}
                    >
                        <TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default UpdateProfile;
