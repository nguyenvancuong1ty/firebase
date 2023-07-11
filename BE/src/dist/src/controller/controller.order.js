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
const cache_1 = require("../middleware/cache");
const response_success_1 = require("../utils/response.success");
const service_order_1 = __importDefault(require("../service/service.order"));
const response_error_1 = require("../utils/response.error");
class OrderController {
    getOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_order_1.default.getOrder(req, res);
            (0, cache_1.saveDataToCache)(req, data);
            return new response_success_1.OK(data).send(res);
        });
    }
    getNewOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_order_1.default.getNewOrder(req, res);
            return new response_success_1.OK(data).send(res);
        });
    }
    addOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_order_1.default.addOrder(req, res);
            return new response_success_1.CREATED(data).send(res);
        });
    }
    getOrderForCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_order_1.default.getOrderForCustomer(req, res);
            return new response_success_1.OK(data).send(res);
        });
    }
    deleteShallowOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield service_order_1.default.deleteShallowOrder(req, res);
            return new response_success_1.OK(undefined, 'delete OK').send(res);
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_order_1.default.updateOrder(req, res);
            if (data) {
                return new response_success_1.OK(data, 'update OK').send(res);
            }
            else {
                return new response_error_1.Conflict('Đơn đã có người nhận').send(res);
            }
        });
    }
    notifyForOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield service_order_1.default.notifyForOrder(req, res);
            return new response_success_1.CREATED().send(res);
        });
    }
}
exports.default = OrderController;
