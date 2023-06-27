const express = require('express');
const productRouter = express.Router();

const {
    getAllProduct,
    getOrder,
    getNewOrder,
    addOrder,
    updateOrder,
    getOrderForCustomer,
    deleteShallowOrder,
    getCartbyUser,
    addToCart,
    updateCart,
} = require('../api');
const { authentication } = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const { cache } = require('../middleware/cache');
productRouter.use(authentication);
productRouter.get('/cake', cache, getAllProduct);
// productRouter.post('/cake', addCake);
// productRouter.patch('/cake', updateCake);
// productRouter.delete('/cake', deleteCake);
// productRouter.get('/cakes', addCakes);

productRouter.get('/order', getOrder);
productRouter.get('/new-order', getNewOrder);
productRouter.post('/order', addOrder);
productRouter.patch('/order', updateOrder);
productRouter.get('/order-for-customer', authorization(['customer']), getOrderForCustomer);
productRouter.patch('/order/:id', deleteShallowOrder);

productRouter.get('/cart/:uid', getCartbyUser);
productRouter.post('/cart', addToCart);
productRouter.patch('/cart/:id', updateCart);

module.exports = productRouter;
