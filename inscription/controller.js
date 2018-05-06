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
  console.log("Inscription data", inscriptionData);
  var verify = verifyFieldsInscription(inscriptionData); //verifica que existe userId y advertId
  if (!verify.success) {
    res.status(400).json({ message: verify.message });
    return;
  }

  // if (inscriptionData.userId == req.decoded.userID) {
  //   res.status(400).json({ message: "No te puedes inscribir a tu propio anuncio" });
  //   return;
  // }

  userDB.findUserById(inscriptionData.userId).then(found => {
    if (!found) {
      res.status(400).json({ message: "Este userId no existe." });
    } else {
      advertDB.findAdvertById(inscriptionData.advertId).then(found => {
        if (!found) {
          res.status(400).json({ message: "Este advertId no existe." });
        } else {
          inscriptionDB.existsInscriptionUserAdvert(inscriptionData.userId, inscriptionData.advertId).then(
            inscription => {
              if (inscription.length > 0) {
                res.status(400).json({ message: "El usuario ya está inscrito a este anuncio" });
              } else {
                advertDB.addRegisteredUser(inscriptionData.advertId, inscriptionData.userId).then(advert => {
                  inscriptionDB.saveInscription(inscriptionData).then(inscription => {
                    res.send(inscription);
                  }).catch(err => {
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
  }).catch(err => {
    res.status(400).json({ message: "Error en verificación de identificador de usuario: " + err.message });
  });
}

exports.getInscriptions = function (req, res, next) {
  if (!req.params.advertId) {
    res.status(400).json({ message: "Es necesita un identificador per a trobar un advert." });
  } else if (req.params.advertId.match(/^[0-9a-fA-F]{24}$/)) {
    var result = {}
    var advertId = req.params.advertId;
    advertDB.findAdvertById(advertId).then(advert => {
      result['advert'] = advert;
      return inscriptionDB.findInscriptionsAdvert(advertId);
    }).then(data => {
      var itemsProcessed = 0;
      var inscriptionProcessed = [];
      if(data.length > 0){
        data.forEach((item, index, array) => {
          var inscription = JSON.parse(JSON.stringify(item));
          userDB.findUserById(inscription.userId).then(user => {
            inscription['user'] = user;
            inscriptionProcessed.push(inscription);
            itemsProcessed++;
            if (itemsProcessed === array.length) {
              result['inscriptions'] = inscriptionProcessed;
              res.send(result);
            }
          }).catch(err => {
            res.status(400).json(err);
          });
        });
      }else{
        result['inscriptions'] = [];
        res.send(result);
      }
    }).catch(err => {
      res.status(400).json({ message: "Ha ocurrido un error: "+ err.message});
    });
  } else {
    res.status(400).json({ message: "advertId invalid" });
  }
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

}

exports.solveInscriptionUser = function (req, res, next) {
  var inscriptionData = req.body;

  var verify = verifyFieldsSolveInscription(inscriptionData, req.params.id);
  if (!verify.success) {
    res.status(400).json({ message: verify.message });
    return;
  }

  userDB.findUserById(inscriptionData.userId).then(user => {
    advertDB.findAdvertById(req.params.id).then(advert => {
      inscriptionDB.existsInscriptionUserAdvert(inscriptionData.userId, req.params.id).then(inscription => {

        if (inscription.length == 0) {
          res.status(400).json({ message: "Inscription doesn't exists" })
        }

        else {
          inscriptionDB.solveInscriptionUser(inscriptionData.userId, req.params.id, inscriptionData.status).then(inscription => {
            res.send(inscription);
          }).catch(err => {
            res.status(400).json({ message: err.message });
          })
        }
      }).catch(err => {
        res.status(400).json({ message: err.message });
      })

    }).catch(err => {
      res.status(400).json({ message: err.message });
    })
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
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

verifyFieldsSolveInscription = function (inscriptionData) {
  if (!inscriptionData.userId || !inscriptionData.status) {
    return { success: false, message: "Faltan datos obligatorios: userId, status" };
  }
  var validTypes = ["pending", "refused", "completed", "accepted"];
  if (inscriptionData.status) {
    if (validTypes.indexOf(inscriptionData.status) == -1) {
      return { success: false, message: "type tiene que ser: [pending, refused, completed, accepted]" };
    }
  }
  return { success: true };
}
