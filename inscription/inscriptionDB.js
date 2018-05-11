var mongoose = require('mongoose');
var models = require('./models');

/**
 * @swagger
 * tags:
 *   name: Inscription
 *   description: Inscription del sistema
 */

// Register the schema
var Inscription = mongoose.model('Inscription', models.InscriptionSchema);
var advertDB = require('../advert/advertDB');

exports.Inscription = Inscription;
exports.saveInscription = function (inscriptionData) {
  var inscription = new Inscription(inscriptionData);
  return new Promise(function (resolve, reject) {
    inscription.save()
      .then(inscription => {
        resolve(inscription);
      })
      .catch(err => {
        console.log("Error saving Inscription: " + err.message);
        reject(err);
      })
  });
}

exports.findInscriptionsAdvert = function (idAdvert) {
  return new Promise(function (resolve, reject) {
    Inscription.find({ advertId: idAdvert }, function (err, inscriptions) {
      if (err) {
        console.log("Error finding:", err);
        reject(err)
      }
      resolve(inscriptions);
    });
  })
}

exports.findInscriptionsUser = function (idUser) {
  return new Promise(function (resolve, reject) {
    Inscription.find({ userId: idUser }, function (err, inscriptions) {
      if (err) {
        console.log("Error finding:", err);
        reject(err)
      }
      resolve(inscriptions);
    });
  })
}

exports.existsInscriptionUserAdvert = function (idUser, idAdvert) {
  return new Promise(function (resolve, reject) {
    Inscription.findOne({ userId: idUser, advertId: idAdvert }, function (err, inscriptions) {
      if (err) {
        reject(err)
      }
      resolve(inscriptions);
    });
  })
}

exports.solveInscriptionUser = function (idUser, idAdvert, newStatus) {
    return new Promise(function (resolve, reject) {
      advertDB.solveInscriptionAdvertUser(idAdvert, idUser, newStatus).then(advert => {
        Inscription.findOneAndUpdate({ userId: idUser, advertId: idAdvert }, {
          $set: {
            status: newStatus
          }
        }, { new: true }, function (err, doc) {
          if (!err) {
            resolve(doc);
          } else {
            reject({ message: "Error solving inscription" });
          }
        })
      }).catch(err => {
        reject(err);
      })
      
    });
}