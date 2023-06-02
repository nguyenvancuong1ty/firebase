import { ExclamationCircleFilled } from '@ant-design/icons';
import './Cart.scss';
import { Checkbox, Empty, Modal, message } from 'antd';
import Quantity from '~/component/Quantity';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Billing from '~/component/Billing';
import { ToastContainer, toast } from 'react-toastify';
function Cart(props) {
    const { confirm } = Modal;
    const [messageApi, contextHolder2] = message.useMessage();
    const [checkOut, setCheckOut] = useState([]);
    const [showBilling, setShowBilling] = useState(false);
    const [total, setTotal] = useState(0);
    const handleDelete = (item) => {
        confirm({
            zIndex: 9999,
            bodyStyle: { height: 150 },
            centered: true,
            icon: <ExclamationCircleFilled />,
            title: 'Xóa hàng',
            content: 'Xóa mặt hàng này vào giỏ hàng của bạn?',
            onOk() {
                axios({
                    url: `http://localhost:3000/firebase/api/cart?id_cart=${item.id}`,
                    method: 'patch',
                })
                    .then(() => {
                        messageApi.open({
                            type: 'success',
                            content: 'Xóa thành công!',
                        });
                    })
                    .catch((e) => {
                        messageApi.open({
                            type: 'error',
                            content: 'Xóa thất bại',
                        });
                    });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
        localStorage.setItem('number_product', localStorage.getItem('number_product') - item.total_quantity);
    };
    const onChange = (e, data) => {
        if (e.target.checked) {
            setCheckOut([...checkOut, data]);
        } else {
            const newItem = checkOut.filter((item) => {
                return item.cakeID !== data.cakeID;
            });
            setCheckOut(newItem);
        }
    };
    useEffect(() => {
        Array.isArray(checkOut) &&
            setTotal(
                checkOut.reduce((init, item) => {
                    return init + item.cake.price * item.quantity;
                }, 0),
            );
    }, [checkOut]);
    return (
        <>
            <div className="wrap_cart">
                {contextHolder2}
                {props.data && props.data.length > 0 ? (
                    <>
                        {props.data.map((item, index) => (
                            <div className="items" key={index}>
                                <Checkbox onChange={(e) => onChange(e, item)}></Checkbox>
                                <img className="images" src={item.cake.images} alt="" />
                                <div className="content">
                                    <b>{item.cake.nameCake}</b>
                                    <div>
                                        <div className="price">Giá: {item.cake.price.toLocaleString('en-US')}</div>

                                        <Quantity item={item} setTotal={setTotal} checkOut={checkOut} />
                                    </div>
                                </div>
                                <button className="delete" onClick={() => handleDelete(item)}>
                                    X
                                </button>
                            </div>
                        ))}

                        <footer>
                            <b className="total_price">
                                Tổng tiền tạm tính: <b>{total.toLocaleString('en-US')}đ</b>
                            </b>
                            (Chưa bao gồm phí ship) <br />
                            <button
                                onClick={() => {
                                    checkOut.length > 0
                                        ? setShowBilling(true)
                                        : toast.warning('Chọn ít nhất 1 sản phẩm!', {
                                              position: toast.POSITION.TOP_CENTER,
                                          });
                                }}
                                className="button"
                            >
                                Tiến hành Đặt hàng
                            </button>
                        </footer>
                        {showBilling && <Billing product={checkOut} total={total} />}
                        <ToastContainer autoClose={1000} />
                    </>
                ) : (
                    <Empty />
                )}
            </div>
        </>
    );
}

export default Cart;
