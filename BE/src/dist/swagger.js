const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./src/routers/account.ts'];
swaggerAutogen(outputFile, endpointsFiles);
