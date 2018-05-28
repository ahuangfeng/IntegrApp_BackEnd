"use strict";
var controller = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

// get an instance of the router for api routes
var apiRoutes = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname )
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

var upload = multer({
    storage: storage,
    limits: {
        filesize: 1024 * 1024 * 8
    },
    fileFilter: fileFilter
});

apiRoutes.post('/fileUpload', upload.single('image'), controller.fileUpload);

apiRoutes.get('/file/:userId', controller.getFiles);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nou usuari
 *     tags: [User]
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/UserBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/UserInfo"
 *       400:
 *         description: Ha hagut un error amb la operació
 *         schema:
 *           $ref: "#/definitions/Error"
 */
apiRoutes.post('/register', controller.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna tots els usuaris registrats
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/UserInfo"
 *       400:
 *         description: Ha hagut un error amb la operació
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/Error"
 */
apiRoutes.get('/users', tokenMiddleware.tokenCheck, controller.getAllUsers);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login de l'usuari
 *     tags: [User]
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/LoginBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/LoginResponse"
 *       401:
 *         description: Login sense éxit
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.post('/login', controller.login);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna un usuari a partir del seu username
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: username
 *         in: query
 *         type: string
 *         description: username del usuari
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/UserWithAdverts"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/user', tokenMiddleware.tokenCheck, controller.getUserByUsername);

/**
 * @swagger
 * /userInfo/{username}:
 *   get:
 *     summary: Retorna un usuari sense la contrasenya a partir del seu username
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: username
 *         in: path
 *         type: string
 *         required: true
 *         description: Username de l'usuari
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/UserWithAdverts"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/userInfo/:username', tokenMiddleware.tokenCheck, controller.getUserInfo);

/**
 * @swagger
 * /userInfoById/{userID}:
 *   get:
 *     summary: Retorna un usuari sense la contrasenya a partir del seu Identificador
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: userID
 *         in: path
 *         type: string
 *         required: true
 *         description: Identificador de l'usuari
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/UserWithAdverts"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/userInfoById/:userID', tokenMiddleware.tokenCheck, controller.getUserInfoById);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Esborra un usuari
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id de l'usuari que es vol eliminar
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Error"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.delete('/user/:id', tokenMiddleware.tokenCheck, controller.deleteUser);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Modificació d'un usuari
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id de l'usuari que es vol modificar
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/ModifUserBody"
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/UserInfo"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.put('/user/:id', tokenMiddleware.tokenCheck, controller.modifyUser);


/**
 * @swagger
 * /like/{userId}:
 *   post:
 *     summary: Fer like a un usuari
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: userId
 *         in: path
 *         type: string
 *         required: true
 *         description: Id de l'usuari que es vol fer like, l'usuari qui fa like el agafem del token
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Es retorna el User del userId
 *         schema:
 *           $ref: "#/definitions/UserInfo"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.post('/like/:userId', tokenMiddleware.tokenCheck, controller.likeUser);

/**
 * @swagger
 * /dislike/{userId}:
 *   post:
 *     summary: Fer dislike a un usuari
 *     tags: [User]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: userId
 *         in: path
 *         type: string
 *         required: true
 *         description: Id de l'usuari que es vol fer dislike, l'usuari qui fa dislike el agafem del token
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Es retorna el User del userId
 *         schema:
 *           $ref: "#/definitions/UserInfo"
 *       400:
 *         description: No s'ha trobat l'usuari
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.post('/dislike/:userId', tokenMiddleware.tokenCheck, controller.dislikeUser);

exports.apiRoutes = apiRoutes;