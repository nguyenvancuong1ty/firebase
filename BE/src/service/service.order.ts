import { Request, Response } from 'express';
import { Timestamp, db, messaging } from '../db/firebase';
import Order from '../models/model.order';

class OrderService {
    static async getOrder(req: Request, res: Response): Promise<Array<Order | any>> {
        const { id, type } = req.query;
        const orderRef = db.collection('order');
        const querySnapshot = await orderRef.where('deleted', '==', false).where('id_user_shipper', '==', id).where('status', '==', type).get();

        const response: Array<Order | any> = [];
        querySnapshot.forEach((doc: any) => {
            const product: Order = doc.data();
            const productWithDocId = {
                Id: doc.id,
                ...product,
            };
            response.push(productWithDocId);
        });

        return response;
    }

    static async getNewOrder(req: Request, res: Response): Promise<Array<Order | any>> {
        const productsRef = db.collection('order');
        const querySnapshot = await productsRef.where('status', '==', 'pending').where('deleted', '==', false).get();

        const response: Array<Order> = [];
        querySnapshot.forEach((doc: any) => {
            const product = doc.data();
            const productWithDocId = {
                Id: doc.id,
                ...product,
            };
            response.push(productWithDocId);
        });
        return response;
    }

    static async addOrder(req: Request, res: Response): Promise<Order | any> {
        const { uid, shipping_address, detail, weight, shipping_cost, total_amount } = req.body;
        const newOrder: Order = {
            deleted: false,
            detail: detail,
            user_order: uid,
            total_amount: total_amount * 1,
            shipping_address: shipping_address,
            status: 'pending',
            weight: weight,
            id_user_shipper: '',
            shipping_cost: shipping_cost * 1,
            order_date: Timestamp.fromDate(new Date()),
            start_shipping_date: {},
            shipped_date: {},
        };
        const response = await db.collection('order').add(newOrder);
        return response;
    }

    static async getOrderForCustomer(req: Request, res: Response): Promise<Array<Order | any>> {
        const { id } = req.query;
        const productsRef = db.collection('order');
        const querySnapshot = await productsRef.where('deleted', '==', false).where('user_order', '==', id).get();

        const response: Array<Order> = [];
        querySnapshot.forEach((doc: any) => {
            const product = doc.data();
            const productWithDocId = {
                Id: doc.id,
                ...product,
            };
            response.push(productWithDocId);
        });

        return response;
    }

    static async deleteShallowOrder(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const docRef = db.collection('order').doc(id);
        await docRef.update({
            deleted: true,
            timeUpdate: Timestamp.fromDate(new Date()),
        });
    }

    static async updateOrder(req: Request, res: Response): Promise<Array<Order> | any> {
        const { id, id_user_shipper, status } = req.query;
        const docRef = db.collection('order').doc(id);
        const docSnap = await docRef.get();
        const data = docSnap.data();
        if (status === 'shipping') {
            if (data.status === 'shipping') {
                return false;
            } else {
                await docRef.update({
                    id_user_shipper,
                    status,
                    start_shipping_date: Timestamp.fromDate(new Date()),
                });
                return true;
            }
        } else if (status === 'shipped') {
            await docRef.update({
                status,
                shipped_date: Timestamp.fromDate(new Date()),
            });
            return true;
        } else if (status === 'pending') {
            await docRef.update({
                id_user_shipper: '',
                status,
                start_shipping_date: '',
            });
            return true;
        }
    }

    static async notifyForOrder(req: Request, res: Response) {
        if (req.body.status === 'shipping') {
            const message: object = {
                notification: {
                    title: 'Giao hàng',
                    body: `Đơn hàng ${req.body.id} đã có người nhận giao...`,
                },
                token: req.body.token,
            };

            messaging.send(message);
        } else if (req.body.status === 'pending') {
            const message: object = {
                notification: {
                    title: 'Hủy hàng',
                    body: `shipper đã hủy giao đơn hàng ${req.body.id}`,
                },
                token: req.body.token,
            };

            messaging.send(message);
        } else {
            const message: object = {
                notification: {
                    title: 'Nhận hàng',
                    body: `Đơn hàng  ${req.body.id} sắp đến hãy chuẩn bị nhận.`,
                },
                token: req.body.token,
            };

            messaging.send(message);
        }
        return true;
    }
}

export default OrderService;
