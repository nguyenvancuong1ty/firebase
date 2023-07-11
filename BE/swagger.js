const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = [
    './src/routes/route.account.ts',
    './src/routes/route.product.ts',
    './src/routes/route.cart.ts',
    './src/routes/route.order.ts',
];
swaggerAutogen(outputFile, endpointsFiles);
