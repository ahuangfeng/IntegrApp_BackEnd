
var advertController = require('./controller');
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
* tags:
*   name: Not Implemented
*   description: Funció no implementada encara
*/

/**
 * @swagger
 * /advert:
 *   post:
 *     summary: Creació d'un anunci
 *     tags: [Advert]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/AdvertBody"
 *         description: Fecha en formato DD-MM-YYYY hh:mm
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Advert"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/AdvertFailed"
 */
apiRoutes.post('/advert', tokenMiddleware.tokenCheck, advertController.createAdvert);


/**
 * @swagger
 * /advert:
 *   get:
 *     summary: Retorna els anuncis
 *     tags: [Advert]
 *     security:
 *       - user: []
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
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/AdvertFailed"
 */
apiRoutes.get('/advert', tokenMiddleware.tokenCheck, advertController.getAdverts);


/**
 * @swagger
 * /advert/{id}:
 *   delete:
 *     summary: Esborrat d'un anunci
 *     tags: [Advert]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id de l'anunci que es vol eliminar
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Error"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/AdvertFailed"
 */
apiRoutes.delete('/advert/:id', advertController.deleteAdvert);

/**
 * @swagger
 * /advert:
 *   patch:
 *     summary: Modificació de l'estat d'un anunci
 *     tags: [Not Implemented]
 *     security:
 *       - user: []
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
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/AdvertFailed"
 */
apiRoutes.patch('/advert', tokenMiddleware.tokenCheck, advertController.modifyStateAdvert);

exports.apiRoutes = apiRoutes;