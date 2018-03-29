
var mongoose = require('mongoose');

/**
 * @swagger
 * securityDefinitions:
 *   user:
 *     name: x-access-token
 *     type: apiKey
 *     in: header
 */


/**
 * @swagger
 * definitions:
 *   UserRate:
 *     properties:
 *       totalVotes:
 *         type: number
 *       rate:
 *         type: number
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
 *   UserBody:
 *     required:
 *       - username
 *       - password
 *       - type
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       type:
 *         type: string
 *         enum: [voluntary, admin, newComer, association]
 *       CIF:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   LoginBody:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 */

 /**
 * @swagger
 * definitions:
 *   LoginResponse:
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *         type: string
 *       token:
 *         type: string
 */

 /**
 * @swagger
 * definitions:
 *   LoginFailed:
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *         type: string
 */

 /**
 * @swagger
 * definitions:
 *   User:
 *     required:
 *       - username
 *       - password
 *       - type
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       type:
 *         type: string
 *         enum: [voluntary, admin, newComer, association]
 *       rate:
 *         $ref: "#/definitions/UserRate"
 *       admin:
 *         type: boolean
 *       CIF:
 *         type: string
 */
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  type: String,
  CIF: {
      type: String,
      required: function () {
          if (this.type == "association") return true;
          else return false;
      }
  },
});

exports.UserSchema = UserSchema;


