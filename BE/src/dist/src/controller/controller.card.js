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
const service_cart_1 = __importDefault(require("../service/service.cart")); // Import your CartService
const cache_1 = require("../middleware/cache");
const response_success_1 = require("../utils/response.success");
const response_error_1 = require("../utils/response.error");
class CartController {
    getCartByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_cart_1.default.getCartByUser(req, res);
            (0, cache_1.saveDataToCache)(req, data);
            return new response_success_1.OK(data).send(res);
        });
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_cart_1.default.addToCart(req, res);
            if (data) {
                return new response_success_1.CREATED(data).send(res);
            }
            else {
                return new response_error_1.Conflict('Tài nguyên tồn tại').send(res);
            }
        });
    }
    updateCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield service_cart_1.default.updateCart(req);
            if (data) {
                return new response_success_1.OK(data, 'update OK').send(res);
            }
            else {
                return new response_error_1.INTERNAL_SERVER_ERROR().send(res);
            }
        });
    }
}
exports.default = CartController;
