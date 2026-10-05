const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'SchoolFlow API',
        description: 'RESTful API for managing school students and teachers',
        version: '1.0.0'
    },
    host: 'localhost:8080',
    schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);