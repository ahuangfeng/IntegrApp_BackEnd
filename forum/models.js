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

/**
* @swagger
* definitions:
*   ForumEntry:
*     required:
*       - createdAt
*       - userId
*       - content
*       - forumId
*     properties:
*       userId:
*         type: string
*       username:
*         type: string
*       createdAt:
*         type: string
*       content:
*         type: string
*       forumId:
*         type: string
*/

/**
* @swagger
* definitions:
*   ForumEntryBody:
*     required:
*       - forumId
*       - content
*     properties:
*       forumId:
*         type: string
*       content:
*         type: string
*/
var ForumEntrySchema = new mongoose.Schema({
  userId: String,
  username: String,
  createdAt: String,
  content: String,
  forumId: String,
});


/**
* @swagger
* definitions:
*   FullForum:
*     properties:
*       forum:
*         $ref: "#/definitions/Forum"
*       comments:
*         type: array
*         items:
*           $ref: "#/definitions/ForumEntry"
*/

exports.ForumSchema = ForumSchema;
exports.ForumEntrySchema = ForumEntrySchema;
