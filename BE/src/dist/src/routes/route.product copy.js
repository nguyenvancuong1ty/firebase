"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const productRouter = express.Router();
const authentication_1 = require("../middleware/authentication");
const cache_1 = require("../middleware/cache");
const response_error_1 = require("../utils/response.error");
const controller_product_1 = __importDefault(require("../controller/controller.product"));
const productController = new controller_product_1.default();
//Middleware check permission
productRouter.use(authentication_1.authentication);
//routes
productRouter.get('', cache_1.cache, (0, response_error_1.handleError)(productController.getProduct));
productRouter.get('/search', cache_1.cache, (0, response_error_1.handleError)(productController.getAllProduct));
productRouter.post('', (0, response_error_1.handleError)(productController.addProduct));
productRouter.patch('/:id', (0, response_error_1.handleError)(productController.deleteProduct));
productRouter.put('/:id', (0, response_error_1.handleError)(productController.updateProduct));
// productRouter.get('/order', getOrder);
// productRouter.get('/new-order', getNewOrder);
// productRouter.post('/order', addOrder);
// productRouter.patch('/order', updateOrder);
// productRouter.get('/order-for-customer', authorization(['customer']), getOrderForCustomer);
// productRouter.patch('/order/:id', deleteShallowOrder);
exports.default = productRouter;
