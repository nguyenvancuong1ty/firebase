const express = require('express');
const orderRouter = express.Router();
import { authentication } from '../middleware/authentication';
// import { cache } from '../middleware/cache';
import { handleError } from '../utils/response.error';
import OrderController from '../controller/controller.order';

const orderController = new OrderController();

//routes
orderRouter.get('/order/', authentication, handleError(orderController.getOrder));
orderRouter.get('/order/new-order', authentication, handleError(orderController.getNewOrder));
orderRouter.post('/order/', authentication, handleError(orderController.addOrder));
orderRouter.get('/order/order-for-customer', authentication, handleError(orderController.getOrderForCustomer));
orderRouter.patch('/order/:id', authentication, handleError(orderController.deleteShallowOrder));
orderRouter.patch('/order/', authentication, handleError(orderController.updateOrder));
orderRouter.post('/order/notify', authentication, handleError(orderController.notifyForOrder));

export default orderRouter;
