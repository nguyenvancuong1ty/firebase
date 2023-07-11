import { Request, Response } from 'express';
import { Timestamp, db } from '../db/firebase';
import Product from '../models/model.product'; // Import your Product model
import Cart from '../models/model.card';

class CartService {
    static async getCartByUser(req: Request, res: Response): Promise<Array<Cart>> {
        const { uid } = req.params;
        const cartQuery = db.collection('cart');
        const querySnapshot = await cartQuery.where('uid', '==', uid).where('deleted', '==', false).get();
        const response: Array<any> = [];
        await Promise.all(
            querySnapshot.docs.map(async (doc2: any) => {
                const cartItem: Cart = doc2.data();
                const productDoc: any = await db.collection('products').doc(cartItem.cakeID).get();
                const productData: Product = productDoc.data();
                response.push({ ...cartItem, product: { ...productData }, id: doc2.id });
            }),
        );
        return response;
    }

    static async addToCart(req: Request, res: Response): Promise<any> {
        const { uid, cakeID } = req.body;

        const querySnapshot = await db.collection('cart').where('cakeID', '==', cakeID).where('uid', '==', uid).where('deleted', '==', false).get();
        const response: Array<any> = [];
        querySnapshot.forEach((doc: any) => {
            response.push(doc.data());
        });
        if (!response[0]) {
            await db.collection('cart').add({
                uid,
                cakeID,
                quantity: 1,
                deleted: false,
                createdDate: Timestamp.fromDate(new Date()),
            });
            return true;
        } else {
            return false;
        }
    }

    static async deleteProduct(req: Request): Promise<Array<Product>> {
        const { id } = req.params;
        const productRef = db.collection('products').doc(id);
        const response = await productRef.update({
            deleted: true,
            timeUpdate: Timestamp.fromDate(new Date()),
        });
        return response;
    }

    static async updateCart(req: Request): Promise<Array<Cart>> {
        const { quantity } = req.body;
        const { id } = req.params;
        const docRef = db.collection('cart').doc(id);
        const response = await docRef.update({
            quantity: quantity * 1,
            timeUpdate: Timestamp.fromDate(new Date()),
        });
        return response;
    }
}

export default CartService;
