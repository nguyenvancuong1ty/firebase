const express = require('express');
const { addCake, updateCake, deleteCake, register, addCakes, authenticateToken, addAccounts } = require('./function');
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
    getCartbyUser,
    addToCart,
    addAccountToListNotify,
    notifyForOrder,
    updateCart,
    handleLoginWithGoogle,
    getProduct,
} = require('./api');
const { getDistance } = require('./middleware/getDistance');
const { authentication, refreshToken } = require('./middleware/authentication');
const authorization = require('./middleware/authorization');
const router = express.Router();
router.get('/', (req, res) => {
    res.send('<h1>Chào chúng mày</h1>');
});

router.get('/cake', getProduct);
router.post('/cake', addCake);
router.patch('/cake', updateCake);
router.delete('/cake', deleteCake);

router.get('/cakes', addCakes);

router.get('/accounts', addAccounts);

router.get('/order', getOrder);
router.get('/new-order', getNewOrder);
router.post('/order', addOrder);
router.patch('/order', updateOrder);
router.get('/order-for-customer', authentication, authorization(['customer']), getOrderForCustomer);
router.patch('/order/:id', deleteShallowOrder);

router.post('/login', login);
router.post('/login-google', handleLoginWithGoogle);
router.post('/register', register);

router.get('/cart/:uid', getCartbyUser);
router.post('/cart', addToCart);
router.patch('/cart/:id', updateCart);

router.get('/distance', distance);

router.get('/notification', pushNotification);

router.post('/subscribeToTopic', addAccountToListNotify);

router.post('/notifyForOrder', notifyForOrder);

router.post('/refreshToken', refreshToken);
module.exports = router;
