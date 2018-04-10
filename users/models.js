
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
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       phone:
 *         type: number
 *       type:
 *         type: string
 *         enum: [voluntary, admin, newComer, association]
 *       CIF:
 *         type: string
 */

 /**
 * @swagger
 * definitions:
 *   ModifUserBody:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       phone:
 *         type: number
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
 *   UserInfo:
 *     required:
 *       - username
 *       - password
 *       - type
 *     properties:
 *       username:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       phone:
 *         type: number
 *       type:
 *         type: string
 *         enum: [voluntary, admin, newComer, association]
 *       rate:
 *         $ref: "#/definitions/UserRate"
 *       CIF:
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
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       phone:
 *         type: number
 *       type:
 *         type: string
 *         enum: [voluntary, admin, newComer, association]
 *       rate:
 *         $ref: "#/definitions/UserRate"
 *       CIF:
 *         type: string
 */
var UserSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String,
  email: String,
  phone: Number,
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


