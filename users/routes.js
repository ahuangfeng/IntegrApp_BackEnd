/**
 * Created by siroramirez on 23/05/17.
 */
var controller = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

// get an instance of the router for api routes
var apiRoutes = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nou usuari
 *     tags: [User]
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/UserBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/User"
 *       400:
 *         description: Ha hagut un error amb la operació
 *         schema:
 *           $ref: "#/definitions/Error"
 */
apiRoutes.post('/register', controller.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna tots els usuaris registrats
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/User"
 *       400:
 *         description: Ha hagut un error amb la operació
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/Error"
 */
apiRoutes.get('/users', tokenMiddleware.tokenCheck, controller.getAllUsers);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login de l'usuari
 *     tags: [User]
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/LoginBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/LoginResponse"
 *       401:
 *         description: Login sense éxit
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.post('/login', controller.login);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna un usuari a partir del seu username
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: username
 *         in: query
 *         type: string
 *         description: username del usuari
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/User"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/user', tokenMiddleware.tokenCheck, controller.getUserByUsername);


/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Esborra un usuari
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: username
 *         in: query
 *         type: string
 *         description: username del usuari
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/User"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.delete('/user', tokenMiddleware.tokenCheck, controller.deleteUser);


/**
 * @swagger
 * /user:
 *   put:
 *     summary: Modificació d'un usuari
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: username
 *         in: query
 *         type: string
 *         description: username del usuari
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/User"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.put('/user', tokenMiddleware.tokenCheck, controller.modifyUser);

exports.apiRoutes = apiRoutes;