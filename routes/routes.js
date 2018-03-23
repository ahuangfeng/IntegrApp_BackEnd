/**
 * Created by siroramirez on 23/05/17.
 */
var users = require('./users');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.post('/users', tokenMiddleware.tokenCheck, users.createUser);

apiRoutes.get('/', function (req, res) {
  res.send("IntegrApp API Deployed!");
});

apiRoutes.get('/users', tokenMiddleware.tokenCheck, users.getAllUsers);

apiRoutes.post('/authenticate', users.authenticate);

exports.assignRoutes = function (app) {
  app.use('/api', apiRoutes);
}