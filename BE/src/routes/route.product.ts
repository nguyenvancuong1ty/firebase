const express = require('express');
const productRouter = express.Router();
import { authentication } from '../middleware/authentication';
import { checkApiKey } from '../middleware/auth.Apikey';
import { cache } from '../middleware/cache';
import { handleError } from '../utils/response.error';
import ProductController from '../controller/controller.product';
import { authorization } from '../middleware/authorization';

const productController = new ProductController();

//Middleware check permission

//routes
productRouter.get('/product?', cache, handleError(productController.getProduct));
productRouter.get('/product/search', checkApiKey, cache, handleError(productController.getAllProduct));
productRouter.post('/product', authentication, authorization('admin'), handleError(productController.addProduct));
productRouter.patch('/product/:id', authentication, authorization('admin'), handleError(productController.deleteProduct));
productRouter.put('/product/:id', authentication, authorization('admin'), handleError(productController.updateProduct));
productRouter.get('/product/distance', handleError(productController.distance));

export default productRouter;
