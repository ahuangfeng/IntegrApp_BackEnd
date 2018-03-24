/**
 * Created by siroramirez on 23/05/17.
 */
var users = require('./users');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

// get an instance of the router for api routes
var apiRoutes = express.Router();

/**
   * @swagger
   * definitions:
   *   User:
   *     required:
   *       - username
   *       - password
   *     properties:
   *       username:
   *         type: string
   *       password:
   *         type: string
   *       path:
   *         type: string
   */


apiRoutes.post('/users', tokenMiddleware.tokenCheck, users.createUser);

/**
   * @swagger
   * /:
   *   get:
   *     description: Returns the homepage
   *     responses:
   *       200:
   *         description: IntegrApp Back-End Deployed!
   */

/**
   * @swagger
   * /api:
   *   get:
   *     description: Returns the homepage
   *     responses:
   *       200:
   *         description: IntegrApp API Deployed!
   */
apiRoutes.get('/', function (req, res) {
  res.send("IntegrApp API Deployed!");
});

apiRoutes.get('/users', tokenMiddleware.tokenCheck, users.getAllUsers);

/**
 * @swagger
 * /login:
 *   post:
 *     description: Login to the application (docs no actualizados!)
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
apiRoutes.post('/login', users.authenticate);

exports.assignRoutes = function (app) {
  app.use('/api', apiRoutes);
}