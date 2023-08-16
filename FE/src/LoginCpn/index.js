import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import LoadingAntd from '~/Loading/Loading.antd';
import LoginFacebook from '~/LoginFacebook';
import LoginGithub from '~/LoginGithub';
import LoginGoogle from '~/LoginGoogle';
import Register from '~/component/Register';
const LoginCpn = ({ setShow, setUid }) => {
    const [showRegister, setShowRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const onFinish = async (values) => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/account/login`,
            method: 'POST',
            data: values,
            withCredentials: true,
        })
            .then((res) => {
                notifySuccess();
                localStorage.setItem('uid', res.data.metadata.data.Id);
                localStorage.setItem('address', res.data.metadata.data.address);
                localStorage.setItem('account', res.data.metadata.data.type_account);
                localStorage.setItem('token', res.data.metadata.accessToken);
                setUid(res.data.metadata.data.Id);
                setTimeout(() => {
                    setLoading(false);
                    setShow(false);
                }, 1000);
            })
            .catch((e) => {
                notify();
                setLoading(false);
            });
    };
    const notify = () => {
        toast.warn('Invalid email or password !', { position: toast.POSITION.TOP_CENTER });
    };
    const notifySuccess = () => {
        toast.success('Login success !', { position: toast.POSITION.TOP_CENTER });
    };
    return (
        <Container>
            <div
                className="overlay-login"
                onClick={() => {
                    setShow(false);
                }}
            >
                {!showRegister ? (
                    <Row lg={2} md={2} sm={1} xl={3} xs={1} className="overlay-wrap">
                        <Col
                            className="wrap"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
                            >
                                {' '}
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Email!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined className="site-form-item-icon" />}
                                        placeholder="Email"
                                    />
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
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Remember me</Checkbox>
                                    </Form.Item>

                                    <a className="login-form-forgot" href="/" style={{ color: 'red' }}>
                                        Forgot password
                                    </a>
                                </Form.Item>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100% ' }}>
                                    <LoginFacebook setShow={setShow} setUid={setUid} />
                                    <LoginGoogle setShow={setShow} setUid={setUid} />
                                    <LoginGithub setShow={setShow} setUid={setUid} />
                                </div>
                                <Form.Item
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly',
                                        marginTop: 100,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Log in
                                    </Button>
                                    <span style={{ margin: '0 16px' }}>Or</span>{' '}
                                    <b
                                        style={{ color: 'var(--primary-color--)', cursor: 'pointer' }}
                                        onClick={() => {
                                            setShowRegister(true);
                                        }}
                                    >
                                        register now!
                                    </b>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                ) : (
                    <Register setShow={setShow} setUid={setUid} setShowRegister={setShowRegister}></Register>
                )}
                {loading && <LoadingAntd />}
                <ToastContainer
                    position="top-center"
                    autoClose={1000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </Container>
    );
};
export default LoginCpn;
