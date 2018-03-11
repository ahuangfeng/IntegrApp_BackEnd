/**
 * Created by siroramirez on 23/05/17.
 */
var users = require('./users');
var groups = require('./groups');
var express = require('express');

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.post('/users', users.createUser);

apiRoutes.post('/groups', groups.createGroup);

apiRoutes.get('/', function (req, res) {
    res.send("IntegrApp API Deployed!");
});

exports.assignRoutes = function (app) {
    app.use('/api', apiRoutes);
}