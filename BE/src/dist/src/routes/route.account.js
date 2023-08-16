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
const authorization_1 = require("../middleware/authorization");
const accountController = new controller_account_1.default();
// accountRouter.use(checkApiKey);
accountRouter.get('/account', (0, authorization_1.authorization)(['admin']), (req, res) => {
    res.json('Hello! this is website API of cuongdepchai 😍😍😍');
});
accountRouter.post('/account/login', (0, response_error_1.handleError)(accountController.login));
accountRouter.post('/account/login-google', (0, response_error_1.handleError)(accountController.handleLoginWithGoogle));
accountRouter.post('/account/', auth_Apikey_1.checkApiKey, (0, response_error_1.handleError)(accountController.create));
accountRouter.post('/account/:id', auth_Apikey_1.checkApiKey, (0, response_error_1.handleError)(accountController.changePassword));
accountRouter.get('/account/confirm-code/:email', (0, response_error_1.handleError)(accountController.confirmCode));
accountRouter.post('/account/change-password/:email', authentication_1.authentication, (0, response_error_1.handleError)(accountController.forgetPassword));
exports.default = accountRouter;
