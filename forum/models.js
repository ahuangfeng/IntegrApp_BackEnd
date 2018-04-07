var mongoose = require('mongoose');

/**
* @swagger
* definitions:
*   Forum:
*     required:
*       - title
*       - description
*       - type
*       - userId
*     properties:
*       id:
*         type: string
*       title:
*         type: string
*       description:
*         type: string
*       createdAt:
*         type: string
*       type:
*         type: string
*         enum: [documentation, entertainment, language, various]
*       userId:
*         type: string
*       rate:
*         type: number
*/

/**
* @swagger
* definitions:
*   ForumBody:
*     required:
*       - title
*       - description
*       - type
*     properties:
*       title:
*         type: string
*       description:
*         type: string
*       type:
*         type: string
*         enum: [documentation, entertainment, language, various]
*/

var ForumSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['documentation', 'entertainment', 'language', 'various'],
    default: 'various'
  },
  userId: String,
  createdAt: String,
  rate: Number
});

exports.ForumSchema = ForumSchema;