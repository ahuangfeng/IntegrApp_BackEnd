var inscriptionController = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

var apiRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inscription
 *   description: Inscripcions a anuncis de la aplicació
 */

/**
* @swagger
* tags:
*   name: Not Implemented
*   description: Funció no implementada encara
*/

/**
 * @swagger
 * /inscription:
 *   post:
 *     summary: Creació d'una inscripció a un anunci
 *     tags: [Inscription]
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
 *           $ref: "#/definitions/InscriptionBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Inscription"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/InscriptionFailed"
 */
apiRoutes.post('/inscription', tokenMiddleware.tokenCheck, inscriptionController.createInscription);

/**
 * @swagger
 * /inscription/{advertId}:
 *   get:
 *     summary: Retorna les inscripcions a l'anunci
 *     tags: [Inscription]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: advertId
 *         in: path
 *         type: string
 *         required: true
 *         description: identificador de l'anunci
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Inscription"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/InscriptionFailed"
 */
apiRoutes.get('/inscription/:advertId', tokenMiddleware.tokenCheck, inscriptionController.getInscriptions);

/**
 * @swagger
 * /inscriptionsUser/{userId}:
 *   get:
 *     summary: Retorna les inscripcions a anuncis de l'usuari
 *     tags: [Inscription]
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
 *         required: true
 *         description: identificador de l'usuari
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Inscription"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/InscriptionFailed"
 */
apiRoutes.get('/inscriptionsUser/:userId', tokenMiddleware.tokenCheck, inscriptionController.getInscriptionsUser);
exports.apiRoutes = apiRoutes;