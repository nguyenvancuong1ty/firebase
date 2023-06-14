const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./src/routes.js'];
console.log('ổn');
swaggerAutogen(outputFile, endpointsFiles);
console.log('ko ổn');
