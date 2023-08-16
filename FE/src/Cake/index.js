import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Cake.css';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import { Modal, message } from 'antd';
import { useDispatch } from 'react-redux';
import { increment } from '~/redux';
import api from '~/config/axios';
import { Link } from 'react-router-dom';
const { confirm } = Modal;
function Cake({ item, setShow }) {
    const [messageApi2, contextHolder2] = message.useMessage();
    const dispatch = useDispatch();
    const addToCartSuccess = () => {
        messageApi2.open({
            style: { marginTop: 120 },
            type: 'success',
            content: 'Thêm thành công!',
        });
    };
    const handleAddToCart = async (ID) => {
        try {
            const res = await api.post(
                '/cart',
                {
                    uid: localStorage.getItem('uid'),
                    cakeID: ID,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (res.data.status !== 409) {
                dispatch(increment());
                addToCartSuccess();
            }
        } catch (error) {
            if (error.response.status === 409) {
                addToCartSuccess();
            } else alert(error.status);
        }
    };

    const showConfirm = (cakeID) => {
        confirm({
            style: { marginTop: 150 },
            zIndex: 9999,
            title: 'Mua hàng',
            content: 'Thêm mặt hàng này vào giỏ hàng của bạn?',
            onOk() {
                handleAddToCart(cakeID);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const handleAddCart = (e, cakeID) => {
        e.preventDefault()
        localStorage.getItem('uid') ? showConfirm(cakeID) : setShow(true);
    };
    return (
        <>
            <Link to={`/detail/${item.Id}`} className="product__content--item">
                <img src="./fa.webp" alt="" className="product__content--img" />
                {/* <div className="product__content--img" /> */}
                <div className="product__content--text">
                    <p className="product__content--name">{item.name}</p>
                    <p className="product__content--sale--price">{item.price.toLocaleString('en-US')}đ</p>
                    {/* <span className="product__content--price">{item.price}đ</span> */}
                    <Tooltip title="Add to cart" placement="topRight">
                        <div className="buy" onClick={(e) => handleAddCart(e, item.Id)}>
                            <FontAwesomeIcon icon={faBagShopping} size="xl" className="buy-icon" />
                        </div>
                    </Tooltip>
                    <div className="flashsale__content--bought">
                        <div className="bought">
                            <img
                                src="https://nguyenvancuong1ty.github.io/intern_cake/img/fire-icon.svg"
                                alt=""
                                className="bought--img"
                            />
                            <span className="bought__text">Đã bán</span>
                            <span className="bought__quantity"> {item.sold} </span>
                            <span className="bought__text">Sản phẩm</span>
                        </div>
                        <div
                            className="bought__up"
                            style={{
                                width: `${(item.sold / (item.inventory + item.sold)) * 100}%`,
                            }}
                        ></div>{' '}
                    </div>
                </div>

                <img src={item.images} alt="" className="product__content--img--foreign" />
            </Link>
            {contextHolder2}
        </>
    );
}

export default Cake;
