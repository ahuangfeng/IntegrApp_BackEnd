

var chatController = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

var apiRoutes = express.Router();

apiRoutes.get('/chat', chatController.chat);

exports.apiRoutes = apiRoutes;