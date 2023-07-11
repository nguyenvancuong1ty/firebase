import express from 'express';
import cors from 'cors';
require('dotenv').config();
// const db = require("./firebase");
import helmet from 'helmet';
import { NextFunction, Request, Response } from 'express';
import productRouter from './src/routes/route.product';
import accountRouter from './src/routes/route.account';
import cartRouter from './src/routes/route.cart';
import orderRouter from './src/routes/route.order';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(express.static('public'));
app.use(
    cors({
        origin: 'http://localhost:3006',
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', accountRouter);
app.use('/', productRouter);
app.use('/', cartRouter);
app.use('/', orderRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error: Error = new Error('Pages Not Found');
    req.statusCode = 404;
    next(error);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = req.statusCode || 500;
    console.log(error);
    res.status(statusCode).json({
        statusCode: statusCode,
        message: error.message,
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`.toUpperCase());
});
