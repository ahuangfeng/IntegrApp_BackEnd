var mongoose = require('mongoose');

/**
* @swagger
* definitions:
*   Advert:
*     required:
*       - userId
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
*   AdvertBody:
*     required:
*       - userId
*       - date
*       - title
*       - description
*       - places
*       - typeAdvert
*     properties:
*       userId:
*         type: string
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