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
 *       - userId
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       type:
 *         type: string
 *         enum: [voluntary, admin, newComer, association]
 *       userId:
 *         type: string
 */
