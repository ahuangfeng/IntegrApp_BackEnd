
var controller = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

var apiRoutes = express.Router();

apiRoutes.post('/forum', controller.createForum);

exports.apiRoutes = apiRoutes;