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


