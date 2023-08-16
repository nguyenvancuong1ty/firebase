import React, { memo, useEffect, useState } from 'react';
import { Button, DatePicker, Empty, Modal, Space, Spin } from 'antd';
import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios';
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const Bill = ({ items, setType, type, setDataUser, loading, setLoading, buttonActive, setButtonActive }) => {
    const [data, setData] = useState(items);
    useEffect(() => {
        setData(items);
    }, [items]);
    const calculateTotal = () => {
        return data.reduce((total, item) => {
            return total + item.total_amount;
        }, 0);
    };

    const TotalShippingCost = () => {
        return data.reduce((total, item) => {
            return total + item.shipping_cost;
        }, 0);
    };
    const handleChangeTimePicker = (value) => {
        const newData = items.filter((item) => {
            if (value) {
                if (type === 'pending')
                    return (
                        item.order_date.seconds * 1000 >= value[0].$d.getTime() &&
                        item.order_date.seconds * 1000 < value[1].$d.getTime()
                    );
                if (type === 'shipping')
                    return (
                        item.start_shipping_date.seconds * 1000 >= value[0].$d.getTime() &&
                        item.start_shipping_date.seconds * 1000 < value[1].$d.getTime()
                    );
                if (type === 'shipped')
                    return (
                        item.shipped_date.seconds * 1000 >= value[0].$d.getTime() &&
                        item.shipped_date.seconds * 1000 < value[1].$d.getTime()
                    );
            } else {
                return item;
            }
            return false;
        });
        setData(newData);
    };

    const handlePickup = (item) => {
        confirm({
            zIndex: 9999,
            title: 'Nhận đơn',
            content: 'Nhận hàng bạn phải chịu toàn bộ trách nhiệm với đơn hàng này?',
            onOk() {
                setLoading(true);
                axios({
                    url: `${process.env.REACT_APP_API_URL}/order?id=${item.Id}&id_user_shipper=${localStorage.getItem(
                        'uid',
                    )}&status=shipping&type_date=start_shipping_date`,
                    method: 'patch',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(() => {
                        const newData = items.filter((data) => {
                            return data.Id !== item.Id;
                        });
                        setDataUser(newData);
                        setLoading(false);
                        toast.success('Nhận đơn thành công!', { position: toast.POSITION.TOP_CENTER });
                    })
                    .catch(() => {
                        toast.error('Có người đã nhận đơn này rồi', { position: toast.POSITION.TOP_CENTER });
                        axios({
                            url: `${process.env.REACT_APP_API_URL}/order/new-order`,
                            method: 'get',
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }).then((res) => {
                            setDataUser(res.data.data);
                            setLoading(false);
                        });
                    });
            },
            onCancel() {},
        });
    };
    const handleComplete = (item) => {
        confirm({
            zIndex: 9999,
            title: 'Giao hàng thành công',
            content: 'Bạn đã giao hành thành công chưa?',
            onOk() {
                setLoading(true);
                axios({
                    url: `${process.env.REACT_APP_API_URL}/order?id=${item.Id}&id_user_shipper=${localStorage.getItem(
                        'uid',
                    )}&status=shipped`,
                    method: 'patch',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(() => {
                        const newData = items.filter((data) => {
                            return data.Id !== item.Id;
                        });
                        setDataUser(newData);
                        setLoading(false);
                        toast.success('Hoàn thành', { position: toast.POSITION.TOP_CENTER });
                    })
                    .catch(() => {});
            },
            onCancel() {},
        });
    };
    const handleCancel = (item) => {
        confirm({
            zIndex: 9999,
            title: 'Hủy đơn hàng',
            content: 'Bạn muốn hủy giao đơn hàng ?',
            onOk() {
                setLoading(true);
                axios({
                    url: `${process.env.REACT_APP_API_URL}/order?id=${item.Id}&status=pending`,
                    method: 'patch',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(() => {
                        const newData = items.filter((data) => {
                            return data.Id !== item.Id;
                        });
                        setDataUser(newData);
                        setLoading(false);
                        toast.success('Hủy thành công, hãy chú ý lần sau !', { position: toast.POSITION.TOP_CENTER });
                    })
                    .catch(() => {});
            },
            onCancel() {},
        });
    };
    console.log(buttonActive, '----', type);
    return (
        <div className="bill-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2>Bill</h2>

                <div className="bill-total">
                    <strong>TotalBill: </strong>
                    {calculateTotal().toLocaleString('en-US')}đ<strong> &nbsp; &nbsp;TotalShippingCost: </strong>
                    {TotalShippingCost().toLocaleString('en-US')}đ
                </div>
            </div>
            <div style={{ display: 'flex', margin: '24px 0 18px', justifyContent: 'space-between' }}>
                <div>
                    <Button
                        onClick={() => {
                            setType('shipping');
                            setButtonActive(1);
                        }}
                        className={buttonActive === 1 && 'button-active'}
                    >
                        Đơn đã nhận
                    </Button>
                    <Button
                        className={buttonActive === 2 && 'button-active'}
                        onClick={() => {
                            setType('pending');
                            setButtonActive(2);
                        }}
                    >
                        Nhận đơn mới
                    </Button>
                    <Button
                        className={buttonActive === 3 && 'button-active'}
                        onClick={() => {
                            setType('shipped');
                            setButtonActive(3);
                        }}
                    >
                        Đơn đã giao
                    </Button>
                </div>
                <Space
                    direction="vertical"
                    size={12}
                    style={{ textAlign: 'center', display: 'flex', marginBottom: 12 }}
                >
                    <RangePicker showTime onChange={(value) => handleChangeTimePicker(value)} />
                </Space>
            </div>
            <table className="bill-table">
                <thead>
                    <tr>
                        <th>Order total (excluding shipping)</th>
                        <th>Shipping cost</th>
                        <th>Total</th>
                        <th>Weight</th>
                        <th>Shipping address</th>
                        <th>Shop address</th>
                        {type === 'pending' && <th>Order date</th>}
                        {type === 'shipping' && <th>Order received date</th>}
                        {type === 'shipped' && <th>Shipped date</th>}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading && Array.isArray(data) && data.length > 0 ? (
                        data.map((item) => (
                            <tr key={item.Id}>
                                {/* {console.log(item)} */}
                                <td>{(item.total_amount - item.shipping_cost).toLocaleString('en-US')}đ</td>
                                <td>{item.shipping_cost.toLocaleString('en-US')}đ</td>
                                <td>{item.total_amount.toLocaleString('en-US')}đ</td>
                                <td>{item.weight}kg</td>
                                <td>{item.shipping_address}</td>
                                <td>394 Mỹ Đình 1, Hà Nội</td>
                                {type === 'pending' && (
                                    <>
                                        <td>{new Date(item.order_date.seconds * 1000).toString().slice(0, -26)}</td>
                                        <td>
                                            <Button onClick={() => handlePickup(item)}>Nhận</Button>
                                        </td>
                                    </>
                                )}
                                {type === 'shipping' && (
                                    <>
                                        <td>
                                            {new Date(item.start_shipping_date._seconds * 1000)
                                                .toString()
                                                .slice(0, -26)}
                                        </td>
                                        <td>
                                            <Button onClick={() => handleComplete(item)}>Hoàn thành</Button>
                                            <Button onClick={() => handleCancel(item)}>Hủy</Button>
                                        </td>
                                    </>
                                )}
                                {type === 'shipped' && (
                                    <>
                                        <td>{new Date(item.shipped_date._seconds * 1000).toString().slice(0, -26)}</td>
                                        <td>{item.status}</td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8}>
                                <Empty />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {loading && (
                <Space className="billing-loader" style={{ zIndex: 99 }}>
                    <Spin tip="Loading..." size="large">
                        <span className="content" style={{ marginRight: 50 }} />
                    </Spin>
                </Space>
            )}

            <ToastContainer autoClose={1000} />
        </div>
    );
};

export default memo(Bill);
