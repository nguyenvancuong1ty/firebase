import Product from './model.product';

interface Order {
    deleted: boolean;
    detail: object;
    id_user_shipper: string;
    order_date: object;
    shipped_date: object;
    shipping_address: string;
    shipping_cost: number;
    start_shipping_date: object;
    status: string;
    total_amount: number;
    user_order: string;
    weight: number;
}

export default Order;
