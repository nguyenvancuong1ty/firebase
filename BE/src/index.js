const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routers = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
// const db = require("./firebase");

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
    cors({
        origin: 'http://localhost:3006',
        credentials: true,
    }),
);
app.use(cookieParser());
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/firebase/api/', routers);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
