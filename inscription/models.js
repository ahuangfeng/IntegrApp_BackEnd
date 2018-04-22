var mongoose = require('mongoose');

/**
 * @swagger
 * definitions:
 *   InscriptionFailed:
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   Error:
 *     properties:
 *       message:
 *         type: string
 */

 /**
* @swagger
* definitions:
*   Inscription:
*     required:
*       - userId
*       - advertId
*     properties:
*       inscriptionId:
*         type: string
*       userId:
*         type: string
*       advertId:
*         type: 
*       status:
*         type: string
*         enum: [pending, refused, completed, accepted]
*/

/**
* @swagger
* definitions:
*   InscriptionBody:
*     required:
*       - userId
*       - advertId
*     properties:
*       userId:
*         type: string
*       advertId:
*         type: string
*/


var InscriptionSchema = new mongoose.Schema({
    inscriptionId: String,
    userId: String,
    advertId: String,
    status: {
      type: String,
      enum: ['pending', 'refused', 'completed', 'accepted'],
      default: 'pending'
    }
  });
  
  exports.InscriptionSchema = InscriptionSchema;