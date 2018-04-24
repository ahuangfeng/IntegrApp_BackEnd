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
      Inscription.find({advertId: idAdvert}, function (err, inscriptions) {
        if (err) {
          console.log("Error finding:", err);
          reject(err)
        }
        resolve(inscriptions);
      });
    })
  }