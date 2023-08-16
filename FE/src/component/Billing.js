import { faCircleQuestion, faTruckArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Modal, Space, Spin, Tooltip } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const Billing = ({ product, total, setShowBilling }) => {
    const [address, setAddress] = useState('');
    const [distance, setDistance] = useState(0);
    const [totalShippingCost, setTotalShippingCost] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ref = useRef();
    const handleAddress = () => {
        if (address.length === 0) {
            ref.current.focus();
        } else {
            axios({
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/product/distance?origin=${address}&destination=394 Mỹ Đình 1, Hà Nội`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }).then((res) => {
                setDistance(res.data / 1000);
            });
        }
    };

    const getShipCost = (item, distance) => {
        let shipCost = 0;
        if (item.product.weight * item.quantity <= 1.2) {
            shipCost = distance * 2000;
        } else if (item.product.weight * item.quantity > 1.2 && item.product.weight * item.quantity <= 3) {
            shipCost = distance * 3000;
        } else if (item.product.weight * item.quantity > 3 && item.product.weight * item.quantity <= 5) {
            shipCost = distance * 4000;
        } else if (item.product.weight * item.quantity > 5 && item.product.weight * item.quantity <= 10) {
            shipCost = distance * 5000;
        } else {
            shipCost = distance * 6000;
        }
        return shipCost;
    };
    useEffect(() => {
        const tempTotalShippingCost = product.reduce((accumulator, item) => {
            let itemShippingCost = getShipCost(item, distance);
            return accumulator + itemShippingCost;
        }, 0);
        setTotalShippingCost(tempTotalShippingCost);
    }, [product, distance]);
    const handleClickOrder = () => {
        if (distance === 0) {
            ref.current.focus();
        } else {
            product.length > 0 && handleOrder();
        }
    };
    const handleOrder = () => {
        setLoading(true);
        const promises = product.map((element) => {
            const itemShippingCost = getShipCost(element, distance);
            const data = {
                uid: element.uid,
                shipping_address: address,
                weight: element.product.weight * element.quantity,
                shipping_cost: itemShippingCost,
                total_amount: Math.floor(element.product.price * element.quantity + itemShippingCost),
                detail: {
                    images: element.product.images,
                    name: element.product.name,
                    price: element.product.price,
                    quantity: element.quantity,
                },
            };
            return axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/order`,
                data: data,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        });

        Promise.all(promises)
            .then(() => {
                setLoading(false);
                setShowBilling(false);
                notifySuccess();
            })
            .catch((error) => {
                // Xử lý lỗi nếu cần thiết
                console.error(error);
                setLoading(false);
            });
    };

    const notifySuccess = () => {
        toast.success('Đặt hàng thành công !', { position: toast.POSITION.TOP_CENTER });
    };
    return (
        <div className="billing-wrapper">
            <h2>Hóa đơn</h2>
            <h2
                className="close"
                onClick={() => {
                    setShowBilling(false);
                }}
            >
                X
            </h2>
            <Space direction="horizontal" size="middle">
                <Input
                    placeholder="Địa chỉ giao hàng"
                    ref={ref}
                    addonAfter={
                        <Tooltip title="Địa chỉ mặc định" placement="topRight">
                            <FontAwesomeIcon
                                icon={faCircleQuestion}
                                onClick={() => {
                                    setAddress(localStorage.getItem('address'));
                                }}
                            />
                        </Tooltip>
                    }
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <Button type="primary" onClick={handleAddress}>
                    Ok
                </Button>
            </Space>
            <table className="billing-table">
                <thead>
                    <tr>
                        <th>Demo</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Cân nặng (kg/1sp)</th>
                        <th>Tiền ship</th>
                        <th>Tổng cộng</th>
                    </tr>
                </thead>
                <tbody>
                    {product.map((item, index) => {
                        const itemShippingCost = getShipCost(item, distance);
                        return (
                            <tr key={index}>
                                <td>
                                    <img alt="" src={item.product.images} className="images" />
                                </td>
                                <td>{item.product.name}</td>
                                <td>{item.product.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.product.weight}</td>
                                <td>{itemShippingCost}</td>
                                <td>{Math.floor(item.product.price * item.quantity + itemShippingCost)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="billing-total">
                <h3>
                    Ship từ Mỹ Đình 1, Hà Nội: {distance.toFixed(1)}km{' '}
                    <Tooltip title="Thông tin vận chuyển" placement="topLeft">
                        <FontAwesomeIcon
                            icon={faTruckArrowRight}
                            style={{ color: '#11cd0e' }}
                            onClick={() => setIsModalOpen(true)}
                        />
                    </Tooltip>
                </h3>
                <h3>Tổng ship: {totalShippingCost.toLocaleString('en-US')}đ</h3>
                <h3>Tổng thanh toán: {(total + totalShippingCost).toLocaleString('en-US')}đ</h3>
            </div>
            <div className="billing-customer-info">
                <h3>Thông tin khách hàng</h3>
                {/* Các trường thông tin khách hàng */}
            </div>
            <Tooltip title="Nhập địa chỉ trước khi đặt" placement="top">
                <button className="billing-button" onClick={handleClickOrder}>
                    Đặt hàng
                </button>
            </Tooltip>
            {loading && (
                <Space className="billing-loader">
                    <Spin tip="Loading..." size="large">
                        <div className="content" style={{ marginRight: 50 }} />
                    </Spin>
                </Space>
            )}
            <Modal
                title="Thông tin vận chuyển"
                zIndex={99999}
                open={isModalOpen}
                onOk={() => {
                    setIsModalOpen(false);
                }}
                onCancel={() => {
                    setIsModalOpen(false);
                }}
            >
                <p>Đơn hàng từ dưới 1,2kg (2000đ / 1km)</p>
                <p>Đơn hàng từ từ 1,2kg - 3kg (3000đ / 1km)</p>
                <p>Đơn hàng từ từ 3kg - 5kg (4000đ / 1km)</p>
                <p>Đơn hàng từ từ 5kg - 10kg (5000đ / 1km)</p>
                <p>Đơn hàng từ trên 10kg (6000đ / 1km)</p>
            </Modal>
            <ToastContainer autoClose={1000} />
        </div>
    );
};

export default Billing;
