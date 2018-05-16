var mongoose = require('mongoose');

/**
* @swagger
* definitions:
*   Chat:
*     required:
*       - content
*       - new
*       - from
*       - to
*       - createdAt
*     properties:
*       _id:
*         type: string
*       content:
*         type: string
*       new:
*         type: boolean
*       from:
*         type: string
*         description: userId
*       to:
*         type: string
*         description: userId
*       createdAt: 
*         type: string
*/

var ChatSchema = new mongoose.Schema({
  new: Boolean,
  content: String,
  fromUsername: String,
  from: String,
  toUsername: String,
  to: String,
  createdAt: String
});

exports.ChatSchema = ChatSchema;
