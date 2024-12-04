    const swaggerJSDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

    // Configurações do Swagger
    const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentação da API usando Swagger, BARBERSHOP',
    },
    servers: [
        {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
        },
    ],
    };

    const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './server.js'], // Localização dos arquivos com documentação da API
    };

    const swaggerSpec = swaggerJSDoc(options);

    module.exports = {
    swaggerUi,
    swaggerSpec,
    };
