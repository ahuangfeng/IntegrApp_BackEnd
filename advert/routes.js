
var controller = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

var apiRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Advert
 *   description: Anuncis de la aplicació
 */

/**
 * @swagger
 * /advert:
 *   post:
 *     summary: Creació d'un anunci
 *     tags: [Advert]
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/AdvertBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Advert"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 */
apiRoutes.post('/advert', tokenMiddleware.tokenCheck, controller.createAdvert);


/**
 * @swagger
 * /advert:
 *   get:
 *     summary: Retorna els anuncis
 *     tags: [Advert]
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: type
 *         in: query
 *         type: array
 *         description: Tipus d' anuncis
 *         items:
 *           type: string
 *           enum: [lookFor, offer]
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Advert"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 */
apiRoutes.get('/advert', tokenMiddleware.tokenCheck, controller.getAdverts);

exports.apiRoutes = apiRoutes;