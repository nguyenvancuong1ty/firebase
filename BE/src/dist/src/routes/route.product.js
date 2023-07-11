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
//routes
productRouter.get('', cache_1.cache, (0, response_error_1.handleError)(productController.getProduct));
productRouter.get('/search', cache_1.cache, (0, response_error_1.handleError)(productController.getAllProduct));
productRouter.use(authentication_1.authentication);
productRouter.post('', (0, response_error_1.handleError)(productController.addProduct));
productRouter.patch('/:id', (0, response_error_1.handleError)(productController.deleteProduct));
productRouter.put('/:id', (0, response_error_1.handleError)(productController.updateProduct));
productRouter.get('/distance', (0, response_error_1.handleError)(productController.distance));
exports.default = productRouter;
