"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const accountRouter = express.Router();
const controller_account_1 = __importDefault(require("../controller/controller.account"));
const response_error_1 = require("../utils/response.error");
const auth_Apikey_1 = require("../middleware/auth.Apikey");
const authentication_1 = require("../middleware/authentication");
const accountController = new controller_account_1.default();
accountRouter.use(auth_Apikey_1.checkApiKey);
accountRouter.use(authentication_1.authentication);
accountRouter.get('/', (req, res) => {
    res.json('Hello! this is api website by cuongdepchai 😍😍😍');
});
accountRouter.post('/login', (0, response_error_1.handleError)(accountController.login));
accountRouter.post('/', (0, response_error_1.handleError)(accountController.create));
accountRouter.post('/:id', (0, response_error_1.handleError)(accountController.changePassword));
accountRouter.get('/confirm-code/:id', (0, response_error_1.handleError)(accountController.confirmCode));
accountRouter.post('/change-password/:id', (0, response_error_1.handleError)(accountController.forgetPassword));
exports.default = accountRouter;
