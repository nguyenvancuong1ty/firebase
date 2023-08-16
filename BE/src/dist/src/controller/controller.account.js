"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_account_1 = __importDefault(require("../service/service.account"));
const response_success_1 = require("../utils/response.success");
const response_error_1 = require("../utils/response.error");
class AccountController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_account_1.default.login(req, res);
            if (data) {
                return new response_success_1.OK(data).send(res);
            }
            else {
                return new response_error_1.UnAuthorized('Incorrect username or password').send(res);
            }
        });
    }
    handleLoginWithGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_account_1.default.handleLoginWithGoogle(req, res);
            return new response_success_1.OK(data).send(res);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_account_1.default.create(req, res);
            if (data.Id) {
                return new response_success_1.CREATED(data).send(res);
            }
            return;
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_account_1.default.changePassword(req, res);
            if (data) {
                return new response_success_1.OK(data, 'change password success').send(res);
            }
            else {
                return new response_error_1.Conflict('Incorrect password').send(res);
            }
        });
    }
    confirmCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_account_1.default.confirmCode(req, res);
            console.log('DATA', data);
            if (data) {
                return new response_success_1.OK(data, 'get code success, pleas check you email').send(res);
            }
            else {
                return new response_error_1.Conflict('Email does not exist').send(res);
            }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_account_1.default.forgetPassword(req, res);
            if (data) {
                return new response_success_1.OK().send(res);
            }
            else {
                return new response_error_1.Conflict('Incorrect code').send(res);
            }
        });
    }
}
exports.default = AccountController;
