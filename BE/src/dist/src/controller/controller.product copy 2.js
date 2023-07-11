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
const service_product_1 = __importDefault(require("../service/service.product")); // Import your ProductService
const cache_1 = require("../middleware/cache");
class ProductController {
    getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield service_product_1.default.getProductByType(req.query.type);
                (0, cache_1.saveDataToCache)(req, data);
                return res.json({
                    count: data.length,
                    userAgent: req.header('User-Agent'),
                    data: data,
                });
            }
            catch (error) {
                return res.status(500).json({ error: 'Lỗi ' + error.message });
            }
        });
    }
    getAllProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield service_product_1.default.getAllProduct();
                (0, cache_1.saveDataToCache)(req, data);
                return res.json({
                    count: data.length,
                    userAgent: req.header('User-Agent'),
                    data: data,
                });
            }
            catch (error) {
                return res.status(500).json({ error: 'Lỗi ' + error.message });
            }
        });
    }
}
exports.default = ProductController;
