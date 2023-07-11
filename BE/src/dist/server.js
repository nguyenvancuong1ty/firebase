"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require('dotenv').config();
// const db = require("./firebase");
const helmet_1 = __importDefault(require("helmet"));
const route_product_1 = __importDefault(require("./src/routes/route.product"));
const route_account_1 = __importDefault(require("./src/routes/route.account"));
const route_cart_1 = __importDefault(require("./src/routes/route.cart"));
const route_order_1 = __importDefault(require("./src/routes/route.order"));
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, helmet_1.default)());
app.use(express_1.default.static('public'));
app.use((0, cors_1.default)({
    origin: 'http://localhost:3006',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/account', route_account_1.default);
app.use('/product', route_product_1.default);
app.use('/cart', route_cart_1.default);
app.use('/order', route_order_1.default);
app.use((req, res, next) => {
    const error = new Error('Pages Not Found');
    req.statusCode = 404;
    next(error);
});
app.use((error, req, res, next) => {
    const statusCode = req.statusCode || 500;
    console.log(error);
    res.status(statusCode).json({
        statusCode: statusCode,
        message: error.message,
    });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`.toUpperCase());
});
