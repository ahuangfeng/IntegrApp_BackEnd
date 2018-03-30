
var controller = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

var apiRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Forum
 *   description: Forum de la aplicació
 */

/**
 * @swagger
 * /forum:
 *   post:
 *     summary: Creació d'un forum
 *     tags: [Forum]
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/ForumBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Forum"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 */
apiRoutes.post('/forum', controller.createForum);


/**
 * @swagger
 * /forum:
 *   get:
 *     summary: Retorna els forums
 *     tags: [Forum]
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: type
 *         in: query
 *         type: array
 *         description: Tipus de forums
 *         items:
 *           type: string
 *           enum: [documentation, entertainment, language, various]
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Forum"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 */
apiRoutes.get('/forum', controller.getForums);

exports.apiRoutes = apiRoutes;