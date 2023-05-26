import { useEffect, useState } from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ExclamationCircleFilled } from '@ant-design/icons';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from '~/Cart';
import Search from '~/Search';
import { reset, setCurrent } from '~/redux';
import axios from 'axios';
import { Modal } from 'antd';
const { confirm } = Modal;
function Header({ show, setShow }) {
    const dispatch = useDispatch();
    const number = useSelector((state) => state.numberReducer.number);
    const [isShowCart, setShowCart] = useState(false);
    const uid = localStorage.getItem('uid');
    const [data, setData] = useState([]);
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
                        <img
                            src="https://theme.hstatic.net/200000460475/1000990214/14/logo.png?v=127"
                            alt=""
                            className="logo"
                        />
                    </div>
                    <div className="col-xl-5">
                        <Search />
                    </div>
                    <div className="col-xl-4">
                        <ul className="header__opstion">
                            <li className="order header__opstion--item">
                                <NavLink to="/intro" className="header__opstion--link">
                                    <img
                                        src="https://raw.githubusercontent.com/nguyenvancuong1ty/imagas/main/order-icon.webp"
                                        alt=""
                                        className="header__opstion--img"
                                    />
                                    <p className="header__opstion--title">Đơn hàng</p>
                                </NavLink>
                            </li>
                            <li className="shop header__opstion--item">
                                <NavLink to="/shop" className="header__opstion--link">
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
                                    <div className="header__opstion--link" onClick={() => setShow(true)}>
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
                                    setShowCart(true);
                                }}
                                onMouseLeave={() => {
                                    setShowCart(false);
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
                                {isShowCart && <Cart data={data} />}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="container__head">
                    <ul className="grid wide container__head--navbar">
                        <li className="head__navbar--item">
                            <NavLink to="/" exact="true" className="home head__navbar--link">
                                <b>Trang chủ</b>
                            </NavLink>
                        </li>
                        <li className="head__navbar--item" id="intro">
                            <NavLink to="/intro" className="head__navbar--link">
                                <b>Giới thiệu</b>
                            </NavLink>
                        </li>
                        <li className="head__navbar--item">
                            <NavLink to="/cakes" className="head__navbar--link">
                                <b>Cửa hàng bánh</b>
                            </NavLink>
                        </li>
                        <li className="head__navbar--item">
                            <NavLink to="/sale" className="head__navbar--link">
                                <b> Chương trình khuyến mại </b>
                            </NavLink>
                        </li>
                        <li className="head__navbar--item">
                            <NavLink to="/recipe" className="head__navbar--link">
                                <b>Công thức làm bánh</b>
                            </NavLink>
                        </li>
                        <li className="head__navbar--item">
                            <NavLink to="/news" className="head__navbar--link">
                                <b>Tin tức</b>
                            </NavLink>
                        </li>
                        <li className="head__navbar--item">
                            <NavLink to="/contact" className="head__navbar--link">
                                <b>Liên hệ</b>
                            </NavLink>
                        </li>
                        {parseInt(localStorage.getItem('user_id')) === 138913 && (
                            <li className="head__navbar--item">
                                <NavLink to="/admin/manager/users" className="head__navbar--link">
                                    <b>Quản lý</b>
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            {/* <ToastContainer /> */}
        </header>
    );
}

export default Header;
