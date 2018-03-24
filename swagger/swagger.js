const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const swaggerJSDoc = require('swagger-jsdoc');

var options = {
  swaggerDefinition: {
    info: {
      title: 'IntegrApp BackEnd', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'BackEnd for IntegrApp platform'
    },
    basePath: '/', // Base path (optional)
  },
  apis: ['./routes/routes.js'], // Path to the API docs
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);

exports.swaggerInit = function (app) {
  app.get('/api/api-docs.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
