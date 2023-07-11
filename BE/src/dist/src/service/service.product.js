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
const firebase_1 = require("../db/firebase");
const axios_1 = __importDefault(require("axios"));
class ProductService {
    static getProductByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const productRef = firebase_1.db.collection('products');
            const querySnapshot = yield productRef.where('deleted', '==', false).where('type', '==', type).get();
            const response = [];
            querySnapshot.forEach((doc) => {
                const product = Object.assign({ Id: doc.id }, doc.data());
                response.push(product);
            });
            return response;
        });
    }
    static getAllProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            const productRef = firebase_1.db.collection('products');
            const querySnapshot = yield productRef.where('deleted', '==', false).get();
            const data = [];
            querySnapshot.forEach((doc) => {
                const product = Object.assign({ Id: doc.id }, doc.data());
                data.push(product);
            });
            return data;
        });
    }
    static addAProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, detail, quantity, price, sold, inventory, weight, images, type } = req.body;
            const newProduct = {
                sold: sold,
                images: images,
                quantity: quantity,
                deleted: false,
                price: price,
                name: name,
                weight: weight,
                detail: detail,
                inventory: inventory,
                type: type,
                timeCreate: firebase_1.Timestamp.fromDate(new Date()),
            };
            const response = yield firebase_1.db.collection('products').add(newProduct);
            return response;
        });
    }
    static deleteProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const productRef = firebase_1.db.collection('products').doc(id);
            const response = yield productRef.update({
                deleted: true,
                timeUpdate: firebase_1.Timestamp.fromDate(new Date()),
            });
            return response;
        });
    }
    static updateProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, detail, quantity, price, sold, inventory, weight, images, type } = req.body;
            const productRef = firebase_1.db.collection('products').doc(id);
            const response = yield productRef.update({
                name: name,
                detail: detail,
                quantity: quantity,
                price: price,
                sold: sold,
                inventory: inventory,
                weight: weight,
                images: images,
                type: type,
                timeUpdate: firebase_1.Timestamp.fromDate(new Date()),
            });
            return response;
        });
    }
    static distance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = process.env.apiKey;
            const origin = req.query.origin;
            const destination = req.query.destination;
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
            yield axios_1.default
                .get(url)
                .then((response) => {
                res.header('Access-Control-Allow-Origin', '*');
                return res.json(response.data.rows[0].elements[0].distance.value);
            })
                .catch((e) => {
                res.status(500).json({ error: 'Đã xảy ra lỗi', status: e });
            });
        });
    }
}
exports.default = ProductService;
