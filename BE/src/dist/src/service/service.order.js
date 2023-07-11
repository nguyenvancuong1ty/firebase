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
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../db/firebase");
class OrderService {
    static getOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, type } = req.query;
            const orderRef = firebase_1.db.collection('order');
            const querySnapshot = yield orderRef
                .where('deleted', '==', false)
                .where('id_user_shipper', '==', id)
                .where('status', '==', type)
                .get();
            const response = [];
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const productWithDocId = Object.assign({ Id: doc.id }, product);
                response.push(productWithDocId);
            });
            return response;
        });
    }
    static getNewOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productsRef = firebase_1.db.collection('order');
            const querySnapshot = yield productsRef.where('status', '==', 'pending').where('deleted', '==', false).get();
            const response = [];
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const productWithDocId = Object.assign({ Id: doc.id }, product);
                response.push(productWithDocId);
            });
            return response;
        });
    }
    static addOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, shipping_address, detail, weight, shipping_cost, total_amount } = req.body;
            const newOrder = {
                deleted: false,
                detail: detail,
                user_order: uid,
                total_amount: total_amount * 1,
                shipping_address: shipping_address,
                status: 'pending',
                weight: weight,
                id_user_shipper: '',
                shipping_cost: shipping_cost * 1,
                order_date: firebase_1.Timestamp.fromDate(new Date()),
                start_shipping_date: {},
                shipped_date: {},
            };
            const response = yield firebase_1.db.collection('order').add(newOrder);
            return response;
        });
    }
    static getOrderForCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            const productsRef = firebase_1.db.collection('order');
            const querySnapshot = yield productsRef.where('deleted', '==', false).where('user_order', '==', id).get();
            const response = [];
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const productWithDocId = Object.assign({ Id: doc.id }, product);
                response.push(productWithDocId);
            });
            return response;
        });
    }
    static deleteShallowOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const docRef = firebase_1.db.collection('order').doc(id);
            yield docRef.update({
                deleted: true,
                timeUpdate: firebase_1.Timestamp.fromDate(new Date()),
            });
        });
    }
    static updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, id_user_shipper, status } = req.query;
            const docRef = firebase_1.db.collection('order').doc(id);
            const docSnap = yield docRef.get();
            const data = docSnap.data();
            if (status === 'shipping') {
                if (data.status === 'shipping') {
                    return false;
                }
                else {
                    yield docRef.update({
                        id_user_shipper,
                        status,
                        start_shipping_date: firebase_1.Timestamp.fromDate(new Date()),
                    });
                    return true;
                }
            }
            else if (status === 'shipped') {
                yield docRef.update({
                    status,
                    shipped_date: firebase_1.Timestamp.fromDate(new Date()),
                });
                return true;
            }
            else if (status === 'pending') {
                yield docRef.update({
                    id_user_shipper: '',
                    status,
                    start_shipping_date: '',
                });
                return true;
            }
        });
    }
    static notifyForOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.status === 'shipping') {
                const message = {
                    notification: {
                        title: 'Giao hàng',
                        body: `Đơn hàng ${req.body.id} đã có người nhận giao...`,
                    },
                    token: req.body.token,
                };
                firebase_1.messaging.send(message);
            }
            else if (req.body.status === 'pending') {
                const message = {
                    notification: {
                        title: 'Hủy hàng',
                        body: `shipper đã hủy giao đơn hàng ${req.body.id}`,
                    },
                    token: req.body.token,
                };
                firebase_1.messaging.send(message);
            }
            else {
                const message = {
                    notification: {
                        title: 'Nhận hàng',
                        body: `Đơn hàng  ${req.body.id} sắp đến hãy chuẩn bị nhận.`,
                    },
                    token: req.body.token,
                };
                firebase_1.messaging.send(message);
            }
            return true;
        });
    }
}
exports.default = OrderService;
