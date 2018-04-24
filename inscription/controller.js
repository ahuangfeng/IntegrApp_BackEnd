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
<<<<<<< HEAD
  
    var verify = verifyFieldsInscription(inscriptionData);
=======

    var verify = verifyFields(inscriptionData);
>>>>>>> e7912576e6f20a494d0206f8437bd2d5b6be88e2
    if (!verify.success) {
        res.status(400).json({ message: verify.message });
        return;
    }

    userDB.findUserById(inscriptionData.userId).then(found => {
<<<<<<< HEAD
      if (found == null) {
        res.status(400).json({ message: "Este userId no existe."});
      }
      else {
        advertDB.findAdvertById(inscriptionData.advertId).then(found => {
            if (found == null) {
                res.status(400).json({ message: "Este advertId no existe."});
            }
            else {
                inscriptionDB.existsInscriptionUserAdvert(inscriptionData.userId, inscriptionData.advertId).then(
                    inscription => {
                        if(inscription.length>0) {
                            res.status(400).json({ message: "El usuario ya está inscrito a este anuncio"});
                        }
                        else {
                            advertDB.addRegisteredUser(inscriptionData.advertId, inscriptionData.userId).then(advert => {
                                inscriptionDB.saveInscription(inscriptionData)
                                .then(inscription => {
                                    res.send(inscription);
                                })
                                .catch(err => {
                                    var response = { message: err.message };
                                    res.status(400).json(response);
                                });
                            }).catch(err => {                    
                                    var response = { message: err.message };
                                    res.status(400).json(response);
                                });
                        }
                    }
                )
                                
            }
        }).catch(err => {
            res.status(400).json({ message: "Error en verificación de identificador de advert: " + err.message });
        });
      }
=======
        if (found == null) {
            res.status(400).json({ message: "Este userId no existe." });
        }
        else {
            advertDB.findAdvertById(inscriptionData.advertId).then(found => {
                if (found == null) {
                    res.status(400).json({ message: "Este advertId no existe." });
                }
                else {
                    advertDB.addRegisteredUser(inscriptionData.advertId, inscriptionData.userId).then(advert => {
                        inscriptionDB.saveInscription(inscriptionData)
                            .then(inscription => {
                                res.send(inscription);
                            })
                            .catch(err => {
                                var response = { message: err.message };
                                res.status(400).json(response);
                            });
                    }).catch(err => {
                        var response = { message: err.message };
                        res.status(400).json(response);
                    });
                }
            }).catch(err => {
                res.status(400).json({ message: "Error en verificación de identificador de advert: " + err.message });
            });
        }
>>>>>>> e7912576e6f20a494d0206f8437bd2d5b6be88e2
    }).catch(err => {
        res.status(400).json({ message: "Error en verificación de identificador de usuario: " + err.message });
    });
}

exports.getInscriptions = function (req, res, next) {
    if (!req.params.advertId) {
        res.status(400).json({ message: "Es necesita un identificador per a trobar un advert." });
    }
    else {
        inscriptionDB.findInscriptionsAdvert(req.params.advertId).then(data => {
            res.send(data);
        }).catch(err => {
            res.status(400).send(err);
        });
    }
<<<<<<< HEAD
    
}

exports.getInscriptionsUser = function (req, res, next) {
    if (!req.params.userId) {
        res.status(400).json({ message: "Es necesita un identificador per a trobar l'usuari." });
    }
    else {
        inscriptionDB.findInscriptionsUser(req.params.userId).then(data => {
            res.send(data);
          }).catch(err => {
            res.status(400).send(err);
          });
    }
    
=======

>>>>>>> e7912576e6f20a494d0206f8437bd2d5b6be88e2
}

notImplemented = function (req, res, next) {
    res.status(501).json({ message: "Function not implemented" });
}


verifyFieldsInscription = function (inscriptionData) {
    if (!inscriptionData.userId || !inscriptionData.advertId) {
        return { success: false, message: "Faltan datos obligatorios: userId, advertId" };
    }

    return { success: true };
}
