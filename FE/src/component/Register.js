import { LockOutlined, QrcodeOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Spin } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
function Register({ setShow, setUid, setShowRegister }) {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        console.log(values);
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/account`,
            method: 'POST',
            data: values,
            withCredentials: true,
        })
            .then((res) => {
                setLoading(false);
                console.log(res);
                toast.success('Register success !', { position: toast.POSITION.TOP_CENTER });
                localStorage.setItem('uid', res.data.metadata.Id);
                setUid(res.data.metadata.Id);
                localStorage.setItem('address', res.data.metadata.address);
                localStorage.setItem('account', res.data.metadata.type_account);
                localStorage.setItem('token', res.data.metadata.accessToken);
                setTimeout(() => {
                    setShow(false);
                }, 1000);
            })
            .catch((e) => {
                notify(e);
                setLoading(false);
            });
    };
    const handleConfirmEmail = async () => {
        try {
            setLoading(true);
            await axios({
                url: `${process.env.REACT_APP_API_URL}/account/confirm-code/${form.getFieldsValue(true).email}`,
                method: 'Get',
            });
            toast.success('Go to email get Code', { position: toast.POSITION.TOP_CENTER });
            setDisabled(false);
        } catch (error) {
            toast.error('Email does not exits', { position: toast.POSITION.TOP_CENTER, autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };
    const notify = (e) => {
        toast.error(e.response.data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 20000 });
    };

    return (
        <Row lg={2} md={2} sm={1} xl={3} xs={1} className="overlay-wrap">
            <Col
                className="wrap"
                onClick={(e) => {
                    e.stopPropagation();
                }}
                style={{ position: 'relative', minHeight: '60vh' }}
            >
                <Form
                    form={form}
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <h1>Register</h1>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const hasLetter = /[a-zA-Z]/.test(value);
                                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

                                    if (!hasLetter && !hasSpecialChar) {
                                        return Promise.reject(
                                            'Please enter at least one letter and one special character.',
                                        );
                                    }
                                    if (!hasLetter) {
                                        return Promise.reject('Please enter at least one letter.');
                                    }
                                    if (!hasSpecialChar) {
                                        return Promise.reject('Please enter at least one special character.');
                                    }

                                    return Promise.resolve();
                                },
                            }),
                            {
                                pattern: /^.*@gmail\.com$/,
                                message: 'Please enter a valid Gmail address ending with "@gmail.com".',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name={'confirmCode'}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Code!',
                            },
                        ]}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button type="primary" className="confirm-form-button" onClick={handleConfirmEmail}>
                                Confirm email
                            </Button>
                            <Input
                                prefix={<QrcodeOutlined className="site-form-item-icon" />}
                                placeholder="Code"
                                disabled={disabled}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            current-password="true"
                            disabled={disabled}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Confirm password"
                            current-password="true"
                            disabled={disabled}
                        />
                    </Form.Item>
                    <Form.Item>
                        <a className="login-form-forgot" href="/">
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            marginTop: 100,
                        }}
                        className="res_form"
                    >
                        <Button type="primary" htmlType="submit" className="login-form-button" disabled={disabled}>
                            Register
                        </Button>
                        <span style={{ margin: '0 16px' }}>Or</span>{' '}
                        <b
                            style={{ color: 'var(--primary-color--)', cursor: 'pointer' }}
                            onClick={() => {
                                setShowRegister(false);
                            }}
                        >
                            Login
                        </b>
                    </Form.Item>
                    {loading && (
                        <div
                            style={{
                                position: 'absolute',
                                background: '#ccc',
                                inset: '0',
                                zIndex: 2,
                            }}
                        >
                            <Spin
                                tip="Loading..."
                                size="large"
                                style={{
                                    marginTop: 200,
                                }}
                            >
                                <span className="content" />
                            </Spin>
                        </div>
                    )}
                </Form>
            </Col>
        </Row>
    );
}

export default Register;
