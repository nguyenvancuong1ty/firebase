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
const authorization_1 = require("../middleware/authorization");
const productController = new controller_product_1.default();
//Middleware check permission
//routes
productRouter.get('/product?', cache_1.cache, (0, response_error_1.handleError)(productController.getProduct));
productRouter.get('/product/search', cache_1.cache, (0, response_error_1.handleError)(productController.getAllProduct));
productRouter.post('/product', authentication_1.authentication, (0, authorization_1.authorization)('admin'), (0, response_error_1.handleError)(productController.addProduct));
productRouter.patch('/product/:id', authentication_1.authentication, (0, response_error_1.handleError)(productController.deleteProduct));
productRouter.put('/product/:id', authentication_1.authentication, (0, authorization_1.authorization)('admin'), (0, response_error_1.handleError)(productController.updateProduct));
productRouter.get('/product/distance', (0, response_error_1.handleError)(productController.distance));
exports.default = productRouter;
