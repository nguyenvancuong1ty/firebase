"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = exports.cartRouter = exports.accountRouter = exports.productRouter = void 0;
const route_product_1 = __importDefault(require("./route.product"));
exports.productRouter = route_product_1.default;
const route_account_1 = __importDefault(require("./route.account"));
exports.accountRouter = route_account_1.default;
const route_cart_1 = __importDefault(require("./route.cart"));
exports.cartRouter = route_cart_1.default;
const route_order_1 = __importDefault(require("./route.order"));
exports.orderRouter = route_order_1.default;
