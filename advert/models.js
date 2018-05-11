var mongoose = require('mongoose');

/**
 * @swagger
 * definitions:
 *   AdvertFailed:
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
*   Advert:
*     required:
*       - date
*       - title
*       - description
*       - places
*       - typeAdvert
*     properties:
*       id:
*         type: string
*       userId:
*         type: string
*       createdAt:
*         type: string
*       date:
*         type: string
*       state:
*         type: string
*         enum: [opened, closed]
*       title:
*         type: string
*       description:
*         type: string
*       places:
*         type: number
*       premium:
*         type: boolean
*       typeUser:
*         type: string
*         enum: [voluntary, admin, newComer, association]
*       typeAdvert:
*         type: string
*         enum: [lookFor, offer]
*/

/**
* @swagger
* definitions:
*   AdvertResponse:
*     required:
*       - date
*       - title
*       - description
*       - places
*       - typeAdvert
*     properties:
*       id:
*         type: string
*       userId:
*         type: string
*       createdAt:
*         type: string
*       date:
*         type: string
*       state:
*         type: string
*         enum: [opened, closed]
*       title:
*         type: string
*       description:
*         type: string
*       places:
*         type: number
*       premium:
*         type: boolean
*       typeUser:
*         type: string
*         enum: [voluntary, admin, newComer, association]
*       typeAdvert:
*         type: string
*         enum: [lookFor, offer]
*       user:
*         $ref: "#/definitions/User"
*/

/**
* @swagger
* definitions:
*   AdvertBody:
*     required:
*       - date
*       - title
*       - description
*       - places
*       - typeAdvert
*     properties:
*       date:
*         type: string
*       title:
*         type: string
*       description:
*         type: string
*       places:
*         type: number
*       typeAdvert:
*         type: string
*         enum: [lookFor, offer]
*/

/**
* @swagger
* definitions:
*   ModifAdvertBody:
*     properties:
*       date:
*         type: string
*       title:
*         type: string
*       description:
*         type: string
*       places:
*         type: number
*/


var AdvertSchema = new mongoose.Schema({
  userId: String,
  createdAt: String,
  date: String,
  state: {
    type: String,
    enum: ['opened', 'closed'],
    default: 'opened'
  },
  title: String,
  description: String,
  places: Number,
  premium: Boolean,
  typeUser: {
    type: String,
    enum: ['voluntary', 'admin', 'newComer', 'association']
  },
  typeAdvert: {
    type: String,
    enum: ['lookFor', 'offer'],
    default: 'offer'
  }
});

exports.AdvertSchema = AdvertSchema;