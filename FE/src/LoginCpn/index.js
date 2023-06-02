import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Login from '~/Login';
const LoginCpn = ({ setShow, setUid }) => {
    const onFinish = async (values) => {
        await axios({
            url: 'http://localhost:3000/firebase/api/login',
            method: 'POST',
            data: values,
        })
            .then((res) => {
                notifySuccess();
                localStorage.setItem('uid', res.data.data.Id);
                setUid(res.data.data.Id);
                localStorage.setItem('address', res.data.data.address);
                localStorage.setItem('account', res.data.data.type_account);
                setTimeout(() => {
                    setShow(false);
                }, 1000);
            })
            .catch((e) => {
                notify();
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
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
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
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <a className="login-form-forgot" href="/">
                                    Forgot password
                                </a>
                            </Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100% ' }}>
                                <FontAwesomeIcon icon={faFacebook} style={{ color: '#0052e0' }} size="2xl" />
                                <Login setShow={setShow} />
                                <FontAwesomeIcon icon={faTwitter} style={{ color: '#0087db' }} size="2xl" />
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
                                <a style={{ color: 'var(--primary-color--)' }} href="/">
                                    register now!
                                </a>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <ToastContainer autoClose={1000} />
            </div>
        </Container>
    );
};
export default LoginCpn;
