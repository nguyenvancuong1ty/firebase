const express = require('express');
const {
    addCake,
    updateCake,
    deleteCake,
    register,
    addCakes,
    updateCart,
    authenticateToken,
    addAccounts,
} = require('./function');
const { pushNotification } = require('./notification');
const {
    getOrder,
    distance,
    getNewOrder,
    addOrder,
    updateOrder,
    login,
    getOrderForCustomer,
    deleteShallowOrder,
    getCake,
    getCartbyUser,
    addToCart,
    addAccountToListNotify,
    notifyForOrder,
} = require('./api');
const { getDistance } = require('./middleware/getDistance');
const router = express.Router();
router.get('/', (req, res) => {
    res.send('<h1>Chào chúng mày</h1>');
});

router.get('/cake', getCake);
router.post('/cake', addCake);
router.patch('/cake', updateCake);
router.delete('/cake', deleteCake);

router.get('/cakes', addCakes);

router.get('/accounts', addAccounts);

router.get('/order', getOrder);
router.get('/new-order', getNewOrder);
router.post('/order', addOrder);
router.patch('/order', updateOrder);
router.get('/order-for-customer', getOrderForCustomer);
router.patch('/order/:id', deleteShallowOrder);

router.post('/login', login);
router.post('/register', register);

router.get('/cart/:uid', getCartbyUser);
router.post('/cart', addToCart);
router.patch('/cart/:id', updateCart);

router.get('/distance', distance);

router.get('/notification', pushNotification);

router.post('/subscribeToTopic', addAccountToListNotify);

router.post('/notifyForOrder', notifyForOrder);

module.exports = router;
