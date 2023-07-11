import { Request, Response } from 'express';
import { saveDataToCache } from '../middleware/cache';
import { CREATED, OK } from '../utils/response.success';
import OrderService from '../service/service.order';
import { Conflict } from '../utils/response.error';

class OrderController {
    async getOrder(req: Request, res: Response): Promise<Response> {
        const data: Array<any> = await OrderService.getOrder(req, res);
        saveDataToCache(req, data);
        return new OK(data).send(res);
    }

    async getNewOrder(req: Request, res: Response): Promise<Response> {
        const data = await OrderService.getNewOrder(req, res);
        return new OK(data).send(res);
    }

    async addOrder(req: Request, res: Response): Promise<Response> {
        const data = await OrderService.addOrder(req, res);

        return new CREATED(data).send(res);
    }
    async getOrderForCustomer(req: Request, res: Response): Promise<Response> {
        const data = await OrderService.getOrderForCustomer(req, res);
        return new OK(data).send(res);
    }

    async deleteShallowOrder(req: Request, res: Response): Promise<Response> {
        await OrderService.deleteShallowOrder(req, res);
        return new OK(undefined, 'delete OK').send(res);
    }

    async updateOrder(req: Request, res: Response): Promise<Response> {
        const data = await OrderService.updateOrder(req, res);
        if (data) {
            return new OK(data, 'update OK').send(res);
        } else {
            return new Conflict('Đơn đã có người nhận').send(res);
        }
    }
    async notifyForOrder(req: Request, res: Response): Promise<Response> {
        await OrderService.notifyForOrder(req, res);
        return new CREATED().send(res);
    }
}

export default OrderController;
