"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const orderRouter = express.Router();
const authentication_1 = require("../middleware/authentication");
// import { cache } from '../middleware/cache';
const response_error_1 = require("../utils/response.error");
const controller_order_1 = __importDefault(require("../controller/controller.order"));
const orderController = new controller_order_1.default();
//routes
orderRouter.get('/order/', authentication_1.authentication, (0, response_error_1.handleError)(orderController.getOrder));
orderRouter.get('/order/new-order', authentication_1.authentication, (0, response_error_1.handleError)(orderController.getNewOrder));
orderRouter.post('/order/', authentication_1.authentication, (0, response_error_1.handleError)(orderController.addOrder));
orderRouter.get('/order/order-for-customer', authentication_1.authentication, (0, response_error_1.handleError)(orderController.getOrderForCustomer));
orderRouter.patch('/order/:id', authentication_1.authentication, (0, response_error_1.handleError)(orderController.deleteShallowOrder));
orderRouter.patch('/order/', authentication_1.authentication, (0, response_error_1.handleError)(orderController.updateOrder));
orderRouter.post('/order/notify', authentication_1.authentication, (0, response_error_1.handleError)(orderController.notifyForOrder));
exports.default = orderRouter;
