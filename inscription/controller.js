/**
 * Controller of inscription
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var inscriptionDB = require('./inscriptionDB');
var userDB = require('../users/usersDB');
var advertDB = require('../advert/advertDB');

exports.createInscription = function (req, res, next) {
    var inscriptionData = req.body;
  
    var verify = verifyFields(inscriptionData);
    if (!verify.success) {
      res.status(400).json({ message: verify.message });
      return;
    }
  
    userDB.findUserById(inscriptionData.userId).then(found => {
      if (found == null) {
        res.status(400).json({ message: "Este userId no existe."});
      }
      else {
        advertDB.findAdvertById(inscriptionData.advertId).then(found => {
            if (found == null) {
                res.status(400).json({ message: "Este advertId no existe."});
            }
            else {
                inscriptionDB.saveInscription(inscriptionData)
                    .then(inscription => {
                    res.send(inscription);
                    })
                    .catch(err => {
                    var response = { message: err.message };
                    res.status(400).json(response);
                    });
            }
        }).catch(err => {
            res.status(400).json({ message: "Error en verificación de identificador de advert: " + err.message });
        });
      }
    }).catch(err => {
      res.status(400).json({ message: "Error en verificación de identificador de usuario: " + err.message });
    });
}

notImplemented = function (req, res, next) {
    res.status(501).json({ message: "Function not implemented" });
}


verifyFields = function (inscriptionData) {
    if (!inscriptionData.userId || !inscriptionData.advertId) {
      return { success: false, message: "Faltan datos obligatorios: userId, advertId" };
    }
       
    return { success: true };
  }
