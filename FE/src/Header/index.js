import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ExclamationCircleFilled } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';
import Search from '~/Search';
import { reset, setCurrent } from '~/redux';
import { Modal } from 'antd';
import Cart from '~/Cart';
import { useEffect, useState } from 'react';
import axios from 'axios';
const { confirm } = Modal;
function Header(props) {
    const dispatch = useDispatch();
    const number = useSelector((state) => state.numberReducer.number);
    const uid = localStorage.getItem('uid');
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    let number_product =
        Array.isArray(data) && data.length > 0
            ? data.reduce((init, item) => {
                  return init + item.quantity;
              }, 0)
            : 0;
    useEffect(() => {
        dispatch(setCurrent(number_product));
    }, [number_product]);
    useEffect(() => {
        axios({
            url: `http://localhost:3000/firebase/api/cart/${uid}`,
            method: 'get',
        })
            .then((res) => {
                setData(res.data.data);
            })
            .catch((e) => alert(e.message));
    }, [uid, number]);
    const handleLogout = () => {
        confirm({
            zIndex: 9999,
            bodyStyle: { height: 150 },
            centered: true,
            icon: <ExclamationCircleFilled />,
            title: 'Đăng xuất',
            content: 'Bạn có muốn đăng xuất không?',
            onOk() {
                localStorage.clear();
                dispatch(reset());
                props.setUid(null);
                navigate('/');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <header>
            <div className="container">
                <div className="row header">
                    <div className="col-xl-3">
                        <NavLink to="/">
                            <img
                                src="https://theme.hstatic.net/200000460475/1000990214/14/logo.png?v=127"
                                alt=""
                                className="logo"
                            />
                        </NavLink>
                    </div>
                    <div className="col-xl-5">
                        <Search />
                    </div>
                    <div className="col-xl-4">
                        <ul className="header__opstion">
                            <li className="order header__opstion--item">
                                <NavLink to="/order" className="header__opstion--link">
                                    <img
                                        src="https://raw.githubusercontent.com/nguyenvancuong1ty/imagas/main/order-icon.webp"
                                        alt=""
                                        className="header__opstion--img"
                                    />
                                    <p className="header__opstion--title">Đơn hàng</p>
                                </NavLink>
                            </li>
                            <li className="shop header__opstion--item">
                                <NavLink to="/notify" className="header__opstion--link">
                                    <img
                                        src="https://raw.githubusercontent.com/nguyenvancuong1ty/imagas/main/address-icon.webp"
                                        alt=""
                                        className="header__opstion--img"
                                    />
                                    <p className="header__opstion--title">Cửa hàng</p>
                                </NavLink>
                            </li>
                            <li className="header__opstion--item account">
                                {uid ? (
                                    <>
                                        <div className="header__opstion--link" onClick={handleLogout}>
                                            <img
                                                src="https://raw.githubusercontent.com/nguyenvancuong1ty/imagas/main/account-icon.webp"
                                                alt=""
                                                className="header__opstion--img"
                                            />
                                            <p className="header__opstion--title">Đăng xuất</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="header__opstion--link" onClick={() => props.setShow(true)}>
                                        <img
                                            src="https://raw.githubusercontent.com/nguyenvancuong1ty/imagas/main/account-icon.webp"
                                            alt=""
                                            className="header__opstion--img"
                                        />
                                        <p className="header__opstion--title">Đăng nhập</p>
                                    </div>
                                )}
                            </li>
                            <li
                                className="header__opstion--item product__show"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.setShowCart(true);
                                }}
                            >
                                <div to="/cart" className="header__opstion--link">
                                    <img
                                        src="https://raw.githubusercontent.com/nguyenvancuong1ty/imagas/main/cart-icon.webp"
                                        alt=""
                                        className="header__opstion--img"
                                    />
                                    <p className="header__opstion--title">Giỏ hàng</p>
                                    <div className="number__product">
                                        <span className="number">{number}</span>
                                    </div>
                                </div>
                                {props.showCart && <Cart data={data} />}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <ToastContainer /> */}
        </header>
    );
}

export default Header;
