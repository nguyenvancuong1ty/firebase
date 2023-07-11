import { Request, Response } from 'express';
import { Timestamp, db } from '../db/firebase';
import Product from '../models/model.product'; // Import your Product model
import axios from 'axios';

class ProductService {
    static async getProductByType(type: string): Promise<Array<Product>> {
        const productRef = db.collection('products');
        const querySnapshot = await productRef.where('deleted', '==', false).where('type', '==', type).get();
        const response: Array<Product> = [];
        querySnapshot.forEach((doc: any) => {
            const product: Product = { Id: doc.id, ...doc.data() };
            response.push(product);
        });

        return response;
    }

    static async getAllProduct(): Promise<Array<Product>> {
        const productRef = db.collection('products');
        const querySnapshot = await productRef.where('deleted', '==', false).get();
        const data: Array<Product> = [];
        querySnapshot.forEach((doc: any) => {
            const product: Product = { Id: doc.id, ...doc.data() };
            data.push(product);
        });
        return data;
    }

    static async addAProduct(req: Request, res: Response): Promise<Product> {
        const { name, detail, quantity, price, sold, inventory, weight, images, type } = req.body;
        const newProduct: Product = {
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
            timeCreate: Timestamp.fromDate(new Date()),
        };
        const response = await db.collection('products').add(newProduct);
        return response;
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

    static async updateProduct(req: Request): Promise<Array<Product>> {
        const { id } = req.params;
        const { name, detail, quantity, price, sold, inventory, weight, images, type } = req.body;
        const productRef = db.collection('products').doc(id);
        const response = await productRef.update({
            name: name,
            detail: detail,
            quantity: quantity,
            price: price,
            sold: sold,
            inventory: inventory,
            weight: weight,
            images: images,
            type: type,
            timeUpdate: Timestamp.fromDate(new Date()),
        });
        return response;
    }

    static async distance(req: Request, res: Response) {
        const apiKey = process.env.apiKey;
        const origin: string = req.query.origin as string;
        const destination: string = req.query.destination as string;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
        await axios
            .get(url)
            .then((response) => {
                res.header('Access-Control-Allow-Origin', '*');
                return res.json(response.data.rows[0].elements[0].distance.value);
            })
            .catch((e) => {
                res.status(500).json({ error: 'Đã xảy ra lỗi', status: e });
            });
    }
}

export default ProductService;
