import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExclamationCircleFilled } from '@ant-design/icons';
import './Cake.css';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import { Modal, message } from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { increment } from '~/redux';
const { confirm } = Modal;
function Cake({ item, setShow }) {
    const [messageApi2, contextHolder2] = message.useMessage();
    const dispatch = useDispatch();
    const addToCartSuccess = () => {
        console.log('ce');
        messageApi2.open({
            type: 'success',
            content: 'Thêm thành công!',
        });
    };
    const handleAddToCart = async (ID) => {
        await axios({
            url: `http://localhost:3000/firebase/api/cart`,
            method: 'post',
            data: {
                uid: localStorage.getItem('uid'),
                cakeID: ID,
            },
        })
            .then((res) => {
                if (res.data.status !== 409) {
                    dispatch(increment());
                }
                addToCartSuccess();
            })
            .catch((e) => alert(e.status));
    };

    const showConfirm = (cakeID) => {
        confirm({
            zIndex: 9999,
            icon: <ExclamationCircleFilled />,
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
    const handleAddCart = (cakeID) => {
        localStorage.getItem('uid') ? showConfirm(cakeID) : setShow(true);
    };
    return (
        <>
            <div to={`/detail/${item.id}`} className="product__content--item">
                <img src="./frame_1.webp" alt="" className="product__content--img" />
                <div className="product__content--text">
                    <p className="product__content--name">{item.nameCake}</p>
                    <p className="product__content--sale--price">{item.price.toLocaleString('en-US')}đ</p>
                    {/* <span className="product__content--price">{item.price}đ</span> */}
                    <Tooltip title="Add to cart" placement="topRight">
                        <div className="buy" onClick={() => handleAddCart(item.Id)}>
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
            </div>
            {contextHolder2}
        </>
    );
}

export default Cake;
