import './Header.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ExclamationCircleFilled } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';
import Search from '~/Search';
import { reset, setCurrent, setDataCart, setTypeProduct } from '~/redux';
import { Modal } from 'antd';
import Cart from '~/Cart';
import { useEffect, useState } from 'react';
import axios from 'axios';
const { confirm } = Modal;
function Header(props) {
    const dispatch = useDispatch();
    const number = useSelector((state) => state.numberReducer.number);
    const dataCart = useSelector((state) => state.dataCartReducer.dataCart);
    const [showOption, setShowOption] = useState(false);
    const uid = localStorage.getItem('uid');
    const [active, setActive] = useState(1);
    let number_product =
        Array.isArray(dataCart) && dataCart.length > 0
            ? dataCart.reduce((init, item) => {
                  return init + item.quantity;
              }, 0)
            : 0;
    useEffect(() => {
        dispatch(setCurrent(number_product));
        // eslint-disable-next-line
    }, [number_product]);
    const navigate = useNavigate();
    useEffect(() => {
        uid &&
            axios({
                url: `${process.env.REACT_APP_API_URL}/cart/${uid}`,
                method: 'get',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((res) => {
                    const newData =
                        res.data &&
                        res.data.metadata.sort((a, b) => {
                            return a.product.price - b.product.price;
                        });
                    dispatch(setDataCart(newData));
                })
                .catch((e) => alert(e.message));
        // eslint-disable-next-line
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
    const handleClickOption = () => {};
    return (
        <header>
            <div className="container res_header">
                <div className="row header">
                    <div className="col-xl-3">
                        <NavLink to="/" className="res_logo">
                            <img
                                src="https://theme.hstatic.net/200000460475/1000990214/14/logo.png?v=127"
                                alt=""
                                className="logo"
                            />
                        </NavLink>
                        <div className="opstion" onClick={handleClickOption}>
                            <div className="opstion--icon"></div>
                            <div className="opstion--icon"></div>
                            <div className="opstion--icon"></div>
                        </div>
                    </div>
                    <div className="col-xl-5 res_search">
                        <Search />
                    </div>
                    <div className="col-xl-4 res_option">
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
                                <NavLink to="/shop" className="header__opstion--link">
                                    <img
                                        src="https://raw.githubusercontent.com/nguyenvancuong1ty/imagas/main/ba.png"
                                        alt=""
                                        className="header__opstion--img"
                                    />
                                    <p className="header__opstion--title">Thông tin</p>
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
                                {props.showCart && <Cart uid={uid} dataCart={dataCart} />}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="container__head">
                    <ul className="grid wide container__head--navbar">
                        <Link
                            to="/"
                            onClick={() => {
                                dispatch(setTypeProduct('cake'));
                                setActive(1);
                            }}
                            className={active === 1 ? 'head__navbar--item active' : 'head__navbar--item'}
                            id="intro"
                        >
                            <div className="head__navbar--link">
                                <b>Bánh</b>
                            </div>
                        </Link>
                        <Link
                            to="/"
                            onClick={() => {
                                dispatch(setTypeProduct('candy'));
                                setActive(2);
                            }}
                            className={active === 2 ? 'head__navbar--item active' : 'head__navbar--item'}
                        >
                            <div className="head__navbar--link">
                                <b>Kẹo</b>
                            </div>
                        </Link>
                        <Link
                            to="/"
                            onClick={() => {
                                dispatch(setTypeProduct('houseware'));
                                setActive(3);
                            }}
                            className={active === 3 ? 'head__navbar--item active' : 'head__navbar--item'}
                        >
                            <div className="head__navbar--link">
                                <b>Đồ gia dụng </b>
                            </div>
                        </Link>
                        <Link
                            to="/"
                            onClick={() => {
                                dispatch(setTypeProduct('electronic device'));
                                setActive(4);
                            }}
                            className={active === 4 ? 'head__navbar--item active' : 'head__navbar--item'}
                        >
                            <div className="head__navbar--link">
                                <b>Đồ điện tử</b>
                            </div>
                        </Link>
                        <Link
                            to="/"
                            onClick={() => {
                                dispatch(setTypeProduct('smart device'));
                                setActive(5);
                            }}
                            className={active === 5 ? 'head__navbar--item active' : 'head__navbar--item'}
                        >
                            <div className="head__navbar--link">
                                <b>Thiết bị thông minh</b>
                            </div>
                        </Link>
                        <Link
                            to="/"
                            onClick={() => {
                                dispatch(setTypeProduct('clothes'));
                                setActive(6);
                            }}
                            className={active === 6 ? 'head__navbar--item active' : 'head__navbar--item'}
                        >
                            <div className="head__navbar--link">
                                <b>Quần áo</b>
                            </div>
                        </Link>
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default Header;
