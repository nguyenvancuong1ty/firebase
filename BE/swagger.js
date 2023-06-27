const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./src/routers/routes.js'];
swaggerAutogen(outputFile, endpointsFiles);
