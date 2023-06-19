import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Empty, Modal, Space, Spin } from 'antd';
import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios';
import { Container } from 'react-bootstrap';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '~/firebase';
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const OrderPage = () => {
    const [data, setData] = useState([]);
    const [dataFilter, setDataFilter] = useState(data);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios({
            method: 'get',
            url: `http://localhost:3000/firebase/api/order-for-customer?id=${localStorage.getItem('uid')}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then((res) => {
            setData(res.data.data);
            setDataFilter(res.data.data);
            setLoading(false);
        });
    }, []);
    const calculateTotal = () => {
        return data.reduce((total, item) => {
            return total + item.total_amount;
        }, 0);
    };
    useEffect(() => {
        setLoading(true);
        const ordersRef = collection(db, 'order');
        const queryRef = query(
            ordersRef,
            where('deleted', '==', false),
            where('user_order', '==', localStorage.getItem('uid')),
        );

        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' && change.doc.exists()) {
                } else if (change.type === 'removed') {
                } else if (change.type === 'modified') {
                    const newOrder = data.filter((item) => {
                        return item.Id !== change.doc.id;
                    });
                    setData([...newOrder, { Id: change.doc.id, ...change.doc.data() }]);
                }
            });

            setLoading(false);
        });

        return () => unsubscribe();
    }, [data]);
    const TotalShippingCost = () => {
        return data.reduce((total, item) => {
            return total + item.shipping_cost;
        }, 0);
    };
    const handleChangeTimePicker = (value) => {
        if (value) {
            const newData = dataFilter.filter((item) => {
                if (item.status === 'pending')
                    return (
                        item.order_date.seconds * 1000 >= value[0].$d.getTime() &&
                        item.order_date.seconds * 1000 < value[1].$d.getTime()
                    );
                if (item.status === 'shipping')
                    return (
                        item.start_shipping_date.seconds * 1000 >= value[0].$d.getTime() &&
                        item.start_shipping_date.seconds * 1000 < value[1].$d.getTime()
                    );
                if (item.status === 'shipped')
                    return (
                        item.shipped_date.seconds * 1000 >= value[0].$d.getTime() &&
                        item.shipped_date.seconds * 1000 < value[1].$d.getTime()
                    );
                return false;
            });
            setData(newData);
        } else {
            setData(dataFilter);
        }
    };
    const handleCancel = (item) => {
        confirm({
            zIndex: 9999,
            title: 'Hủy đơn hàng',
            content: 'Bạn muốn hủy giao đơn hàng ?',
            onOk() {
                setLoading(true);
                axios({
                    url: `http://localhost:3000/firebase/api/order/${item.Id}`,
                    method: 'patch',
                })
                    .then(() => {
                        const newData = data.filter((data) => {
                            return data.Id !== item.Id;
                        });
                        setData(newData);
                        setLoading(false);
                        toast.success('Hủy thành công, hãy chú ý lần sau !', { position: toast.POSITION.TOP_CENTER });
                    })
                    .catch(() => {});
            },
            onCancel() {},
        });
    };
    return (
        <Container>
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
                            <th>Date</th>
                            <th>Status</th>
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
                                    {console.log(item)}
                                    {item.status === 'pending' && (
                                        <td>{new Date(item.order_date._seconds * 1000).toString().slice(0, -26)}</td>
                                    )}
                                    {item.status === 'shipping' && (
                                        <td>
                                            {new Date(item.start_shipping_date._seconds * 1000)
                                                .toString()
                                                .slice(0, -26)}
                                        </td>
                                    )}
                                    {item.status === 'shipped' && (
                                        <td>{new Date(item.shipped_date._seconds * 1000).toString().slice(0, -26)}</td>
                                    )}
                                    <td>{item.status}</td>
                                    <td>
                                        {item.status === 'pending' && (
                                            <Button onClick={() => handleCancel(item)}>Hủy đơn</Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9}>
                                    <Empty />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {loading && (
                    <Space className="billing-loader">
                        <Spin tip="Loading..." size="large">
                            <div className="content" style={{ marginRight: 50 }} />
                        </Spin>
                    </Space>
                )}
                <ToastContainer autoClose={1000} />
            </div>
        </Container>
    );
};

export default OrderPage;
