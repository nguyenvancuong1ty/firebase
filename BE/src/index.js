const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routers = require('./routers/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
// const db = require("./firebase");
const helmet = require('helmet');
const productRouter = require('./routers/product');

const app = express();

app.use(helmet());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
    cors({
        origin: 'http://localhost:3006',
        credentials: true,
    }),
);
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/firebase/api/', routers);
app.use('/firebase/api/product/', productRouter);

module.exports = app;
