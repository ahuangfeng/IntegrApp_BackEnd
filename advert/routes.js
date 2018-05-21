
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
 *         description: Fecha en formato YYYY-MM-DD hh:mm:ss
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
 *             $ref: "#/definitions/AdvertResponse"
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
 *   get:
 *     summary: Obtenció d'un anunci
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
 *         description: Id de l'anunci que es vol obtenir
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/AdvertResponse"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/AdvertFailed"
 */
apiRoutes.get('/advert/:id',tokenMiddleware.tokenCheck, advertController.getAdvertId);

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
apiRoutes.delete('/advert/:id',tokenMiddleware.tokenCheck, advertController.deleteAdvert);

/**
 * @swagger
 * /advertState/{id}:
 *   put:
 *     summary: Modificació de l'estat d'un anunci
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
 *         description: Id de l'anunci que es vol modificar el seu estat
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/ModifStateBody"
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
apiRoutes.put('/advertState/:id', tokenMiddleware.tokenCheck, advertController.modifyStateAdvert);

/**
 * @swagger
 * /advertsUser/{id}:
 *   get:
 *     summary: Retorna els anuncis del Usuari
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
 *         description: Id de l'usuari
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
apiRoutes.get('/advertsUser/:id', tokenMiddleware.tokenCheck, advertController.getAdvertsUser);

/**
 * @swagger
 * /advert/{id}:
 *   put:
 *     summary: Modificació d'un anunci
 *     tags: [Advert]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id de l'anunci que es vol modificar
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/ModifAdvertBody"
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Advert"
 *       400:
 *         description: No s'ha trobat l'anunci
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.put('/advert/:id', tokenMiddleware.tokenCheck, advertController.modifyAdvert);

exports.apiRoutes = apiRoutes;