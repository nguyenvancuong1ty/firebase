const express = require('express');
const cartRouter = express.Router();
import { authentication } from '../middleware/authentication';
import { cache } from '../middleware/cache';
import { handleError } from '../utils/response.error';
import CartController from '../controller/controller.card';

const cartController = new CartController();

//routes
cartRouter.get('/cart/:uid', authentication, handleError(cartController.getCartByUser));
cartRouter.post('/cart', authentication, handleError(cartController.addToCart));
cartRouter.patch('/cart/:id', authentication, handleError(cartController.updateCart));
export default cartRouter;
