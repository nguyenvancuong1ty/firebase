import { Request, Response } from 'express';
import CartService from '../service/service.cart'; // Import your CartService
import { client, saveDataToCache } from '../middleware/cache';
import { CREATED, OK } from '../utils/response.success';
import Cart from '../models/model.card';
import { Conflict, INTERNAL_SERVER_ERROR } from '../utils/response.error';

class CartController {
    async getCartByUser(req: Request, res: Response): Promise<Response | any> {
        const data: Array<Cart> = await CartService.getCartByUser(req, res);
        saveDataToCache(req, data);
        return new OK(data).send(res);
    }

    async addToCart(req: Request, res: Response): Promise<Response | any> {
        const data = await CartService.addToCart(req, res);
        if (data) {
            return new CREATED(data).send(res);
        } else {
            return new Conflict('Tài nguyên tồn tại').send(res);
        }
    }

    async updateCart(req: Request, res: Response): Promise<Response | any> {
        const data = await CartService.updateCart(req);
        if (data) {
            return new OK(data, 'update OK').send(res);
        } else {
            return new INTERNAL_SERVER_ERROR().send(res);
        }
    }
}

export default CartController;
