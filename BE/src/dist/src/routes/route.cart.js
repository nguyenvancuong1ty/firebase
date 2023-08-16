"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cartRouter = express.Router();
const authentication_1 = require("../middleware/authentication");
const response_error_1 = require("../utils/response.error");
const controller_card_1 = __importDefault(require("../controller/controller.card"));
const cartController = new controller_card_1.default();
//routes
cartRouter.get('/cart/:uid', authentication_1.authentication, (0, response_error_1.handleError)(cartController.getCartByUser));
cartRouter.post('/cart', authentication_1.authentication, (0, response_error_1.handleError)(cartController.addToCart));
cartRouter.patch('/cart/:id', authentication_1.authentication, (0, response_error_1.handleError)(cartController.updateCart));
exports.default = cartRouter;
