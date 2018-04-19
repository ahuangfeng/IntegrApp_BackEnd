var controller = require('./controller');
var express = require('express');
var tokenMiddleware = require ('../middleware/tokenVerification');

var apiRoutes = express.Router();

apiRoutes.post('/report', tokenMiddleware.tokenCheck, controller.createReport);

exports.apiRoutes = apiRoutes;