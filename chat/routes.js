

var chatController = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

var apiRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Endpoints per al chat
 */

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Retorna els missatges entre dos usuaris
 *     tags: [Chat]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: from
 *         in: query
 *         type: string
 *         description: userId dels missatges del remitent
 *       - name: to
 *         in: query
 *         type: string
 *         description: userId dels missatges del destinatari
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Chat"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/chat', tokenMiddleware.tokenCheck, chatController.getChat);


/**
 * @swagger
 * /chat/{userId}:
 *   get:
 *     summary: Retorna els missatges del usuari
 *     tags: [Not Implemented]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: userId
 *         in: path
 *         type: string
 *         description: userId dels missatges del remitent
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Chat"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/chat/:id', tokenMiddleware.tokenCheck, chatController.getChatByUserId);

exports.apiRoutes = apiRoutes;