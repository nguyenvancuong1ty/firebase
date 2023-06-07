const { db, auth, Timestamp, messaging } = require('./firebase');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getMessaging } = require('firebase/messaging');
// Create

const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Missing authentication token.' });
    }

    try {
        verifyIdToken(auth, token)
            .then((decodedToken) => {
                const uid = decodedToken.uid;
                console.log(uid);

                // Continue with the rest of your code
                const users = 0;

                if (users.length === 0) {
                    throw new Error('Invalid or expired token.');
                }

                req.user = users[0];
                next();
            })
            .catch((error) => {
                throw new Error('Invalid or expired token.');
            });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: error.message });
    }
};

const getCake = async (req, res) => {
    try {
        const cakesRef = db.collection('cakes');
        // const querySnapshot = await getDocs(query(cakesRef, where('deleted', '==', false)));
        const querySnapshot = await cakesRef.where('deleted', '==', false).get();
        const data = [];
        querySnapshot.forEach((doc) => {
            const cake = doc.data();
            const cakeWithDocId = {
                Id: doc.id,
                ...cake,
            };
            data.push(cakeWithDocId);
        });

        return res.json({
            count: data.length,
            userAgent: req.header('User-Agent'),
            data: data,
        });
    } catch (e) {
        return res.json(e.message);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const querySnapshot = await db.collection('account').where('username', '==', email).get();
    const data = [];
    querySnapshot.docs.map(async (doc) => {
        const account = doc.data();
        data.push({ Id: doc.id, ...account });
    });
    if (Array.isArray(data) && data.length > 0 && bcrypt.compareSync(password, data[0].password)) {
        return res.json({
            message: 'login',
            data: data[0],
        });
        // ...
    } else {
        return res.status(401).json({ Error: 'Invalid email or password' });
    }
};

const getCartbyUser = async (req, res) => {
    const { uid } = req.params;
    try {
        const cartQuery = db.collection('cart');
        const querySnapshot = await cartQuery.where('uid', '==', uid).where('deleted', '==', false).get();
        const data = [];
        await Promise.all(
            querySnapshot.docs.map(async (doc2) => {
                const cartItem = doc2.data();
                const cakeDoc = await db.collection('cakes').doc(cartItem.cakeID).get();
                const cakeData = cakeDoc.data();
                data.push({ ...cartItem, cake: { ...cakeData }, id: doc2.id });
            }),
        );
        return res.json({
            count: data.length,
            data: data,
        });
    } catch (e) {
        return res.json(e.message);
    }
};

const addToCart = async (req, res) => {
    try {
        const { uid, cakeID } = req.body;

        const querySnapshot = await db
            .collection('cart')
            .where('cakeID', '==', cakeID)
            .where('uid', '==', uid)
            .where('deleted', '==', false)
            .get();
        const docSnap = [];
        querySnapshot.forEach((doc) => {
            docSnap.push(doc.data());
        });
        if (!docSnap[0]) {
            await db
                .collection('cart')
                .add({
                    uid,
                    cakeID,
                    quantity: 1,
                    deleted: false,
                    createdDate: Timestamp.fromDate(new Date()),
                })
                .then(() => {
                    return res.json('ok');
                });
        } else {
            return res.json({ status: 409, message: 'tài nguyên tồn tại tồn tại' });
        }
    } catch (e) {
        return res.json(e.message);
    }
};

const updateOrder = async (req, res) => {
    const { id, id_user_shipper, status } = req.query;
    try {
        const docRef = db.collection('order').doc(id);
        const docSnap = await docRef.get();
        const data = docSnap.data();
        if (status === 'shipping') {
            if (data.status === 'shipping') {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Có người đã nhận đơn này',
                });
            } else {
                await docRef.update({
                    id_user_shipper,
                    status,
                    start_shipping_date: Timestamp.fromDate(new Date()),
                });
                return res.json({ message: 'Thành công' });
            }
        } else if (status === 'shipped') {
            await docRef.update({
                status,
                shipped_date: Timestamp.fromDate(new Date()),
            });
            return res.json({});
        } else if (status === 'pending') {
            await docRef.update({
                id_user_shipper: '',
                status,
                start_shipping_date: '',
            });
            return res.json({});
        }
    } catch (e) {
        return res.json(e.message);
    }
};

const updateCart = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { id } = req.params;
        const docRef = db.collection('cart').doc(id);
        await docRef.update({
            quantity: quantity * 1,
            timeUpdate: Timestamp.fromDate(new Date()),
        });

        return res.json('update success');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteShallowOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection('order').doc(id);
        await docRef.update({
            deleted: true,
            timeUpdate: Timestamp.fromDate(new Date()),
        });
        return res.json('delete success');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const { id, type } = req.query;
        const orderRef = db.collection('order');
        const querySnapshot = await orderRef
            .where('deleted', '==', false)
            .where('id_user_shipper', '==', id)
            .where('status', '==', type)
            .get();

        const data = [];
        querySnapshot.forEach((doc) => {
            const cake = doc.data();
            const cakeWithDocId = {
                Id: doc.id,
                ...cake,
            };
            data.push(cakeWithDocId);
        });

        return res.json({
            count: data.length,
            userAgent: req.header('User-Agent'),
            data: data,
        });
    } catch (e) {
        return res.json(e.message);
    }
};

const getOrderForCustomer = async (req, res) => {
    try {
        const { id } = req.query;
        const cakesRef = db.collection('order');
        const querySnapshot = await cakesRef.where('deleted', '==', false).where('user_order', '==', id).get();

        const data = [];
        querySnapshot.forEach((doc) => {
            const cake = doc.data();
            const cakeWithDocId = {
                Id: doc.id,
                ...cake,
            };
            data.push(cakeWithDocId);
        });

        return res.json({
            count: data.length,
            userAgent: req.header('User-Agent'),
            data: data,
        });
    } catch (e) {
        return res.json(e.message);
    }
};

const addOrder = async (req, res) => {
    const { uid, shipping_address, detail, weight, shipping_cost, total_amount } = req.body;
    try {
        await db.collection('order').add({
            user_order: uid,
            total_amount: total_amount * 1,
            shipping_address: shipping_address,
            status: 'pending',
            weight: weight,
            id_user_shipper: '',
            shipping_cost: shipping_cost * 1,
            detail: detail,
            order_date: Timestamp.fromDate(new Date()),
            start_shipping_date: '',
            shipped_date: '',
            deleted: false,
        });
        // subscribeToPendingOrders();
        return res.json('add data success');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    // Đọc tệp tin JSON
};

const getNewOrder = async (req, res) => {
    try {
        const cakesRef = db.collection('order');
        const querySnapshot = await cakesRef.where('status', '==', 'pending').where('deleted', '==', false).get();

        const data = [];
        querySnapshot.forEach((doc) => {
            const cake = doc.data();
            const cakeWithDocId = {
                Id: doc.id,
                ...cake,
            };
            data.push(cakeWithDocId);
        });

        return res.json({
            count: data.length,
            userAgent: req.header('User-Agent'),
            data: data,
        });
    } catch (e) {
        return res.json(e.message);
    }
};

const distance = (req, res) => {
    const apiKey = 'AIzaSyAzaga_IWnHVoBVEMGXazTE3HbFZ_uBkg4';
    const origin = req.query.origin;
    const destination = req.query.destination;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
    axios
        .get(url)
        .then((response) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.json(response.data.rows[0].elements[0].distance.value);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Đã xảy ra lỗi', status: error });
        });
};

const addAccountToListNotify = async (req, res) => {
    const registrationTokens = [req.body.token];
    const topic = 'notifyToAll';
    try {
        messaging.subscribeToTopic(registrationTokens, topic).then((response) => {
            console.log('Successfully subscribed to topic:', response, registrationTokens);
        });
    } catch (error) {
        console.log('Error subscribing to topic:', error);
    }
};
const notifyForOrder = async (req, res) => {
    if (req.body.status === 'shipping') {
        const message = {
            notification: {
                title: 'Đơn hàng',
                body: `Đơn hàng ${req.body.id} đã có người nhận giao...`,
            },
            token: req.body.token,
        };

        messaging.send(message);
    }
    if (req.body.status === 'pending') {
        const message = {
            notification: {
                title: 'Đơn hàng',
                body: `shipper đã hủy giao đơn hàng ${req.body.id}`,
            },
            token: req.body.token,
        };

        messaging.send(message);
    }
};
module.exports = {
    getCake,
    login,
    addOrder,
    getCartbyUser,
    authenticateToken,
    addToCart,
    distance,
    updateCart,
    deleteShallowOrder,
    getOrder,
    getNewOrder,
    addAccountToListNotify,
    updateOrder,
    getOrderForCustomer,
    notifyForOrder,
};
