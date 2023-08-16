import React, { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '~/firebase';
import { db } from '~/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Modal } from 'antd';
import axios from 'axios';
function NotificationComponent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notify, setNotify] = useState(null);
    const [token, setToken] = useState('');
    useEffect(() => {
        const registerNotification = async () => {
            try {
                const currentToken = await getToken(messaging, {
                    vapidKey: 'BMHxPXJyw10y2qfn3W7IljBQE7u1YW7ORLeAubHV3_lJUPiOQBGhndWSv4ZbSXHkIUIzAhyN1AaKmst_naCqNZ8',
                });
                setToken(currentToken);
            } catch (error) {
                console.log('Error:------------------', error);
            }
        };

        // Xử lý Push Notification khi nhận được
        const handlePushNotification = () => {
            onMessage(messaging, (payload) => {
                setNotify(payload);
                console.log(payload);
                setIsModalOpen(true);
            });
        };

        registerNotification();
        handlePushNotification();
    }, []);
    useEffect(() => {
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
                    const newOrder = change.doc.data();
                    console.log(newOrder);
                    newOrder.id_user_shipper &&
                        newOrder.status === 'shipping' &&
                        axios({
                            method: 'post',
                            url: `${process.env.REACT_APP_API_URL}/order/notify`,
                            data: {
                                id: change.doc.id,
                                status: 'shipping',
                                token: token,
                            },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        });
                    newOrder.status === 'pending' &&
                        axios({
                            method: 'post',
                            url: `${process.env.REACT_APP_API_URL}/order/notify`,
                            data: {
                                id: change.doc.id,
                                status: 'pending',
                                token: token,
                            },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        });
                    newOrder.id_user_shipper &&
                        newOrder.status === 'shipped' &&
                        axios({
                            method: 'post',
                            url: `${process.env.REACT_APP_API_URL}/order/notify`,
                            data: {
                                id: change.doc.id,
                                status: 'shipped',
                                token: token,
                            },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        });
                }
            });
        });

        return () => unsubscribe();
    }, [token]);

    return (
        <>
            <Modal
                open={isModalOpen}
                onOk={() => {
                    setIsModalOpen(false);
                }}
                onCancel={() => {
                    setIsModalOpen(false);
                }}
            >
                <div style={{ display: 'flex' }}>
                    <img alt="" src={notify && notify.notification.image} style={{ width: 30, height: 30 }} />
                    <h1>{notify && notify.notification.title}</h1>
                </div>
                <h5>{notify && notify.notification.body}</h5>
            </Modal>
        </>
    );
}

export default NotificationComponent;
