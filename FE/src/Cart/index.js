import { ExclamationCircleFilled } from '@ant-design/icons';
import './Cart.scss';
import { Empty, Modal, message } from 'antd';
import Quantity from '~/component/Quantity';
import axios from 'axios';
function Cart(props) {
    const { confirm } = Modal;
    const [messageApi, contextHolder2] = message.useMessage();
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
    console.log(props.data);
    let total =
        Array.isArray(props.data) &&
        props.data.length > 0 &&
        props.data.reduce((init, item) => {
            return init + item.cake.price * item.quantity;
        }, 0);
    return (
        <>
            <div className="wrap_cart">
                {contextHolder2}
                {props.data && props.data.length > 0 ? (
                    <>
                        {props.data.map((item, index) => (
                            <div className="items" key={index}>
                                <img className="images" src={item.cake.images} alt="" />
                                <div className="content">
                                    <b>{item.cake.nameCake}</b>
                                    <div>
                                        <div className="price">Giá: {item.cake.price.toLocaleString('en-US')}</div>

                                        <Quantity item={item} />
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
                            <button>Tiến hành thanh toán</button>
                        </footer>
                    </>
                ) : (
                    <Empty />
                )}
            </div>
        </>
    );
}

export default Cart;
