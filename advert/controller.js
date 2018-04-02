/**
 * Controller of forum
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var advertDB = require('./advertDB');
var userDB = require('../users/usersDB');

exports.createAdvert = function (req, res, next) {
  var verifyFields = verifyFieldCreation(req.body);
  verifyFields.then(verif => {

    var advertDocument = createAdvertDocument(req.body);

    advertDB.saveAdvert(advertDocument)
      .then(advert => {
        res.send(advert);
      }).catch(err => {
        res.status(400).json({ message: "Ha habido un error en la creación del anuncio :" + err.message })
      });

  }).catch(err => {
    res.status(400).json({ message: err.message });
  });
}

exports.getAdverts = function (req, res, next) {
  var types = req.query.type;
  var typesToGet = [];
  if (types != undefined) {
    typesToGet = types.split(',');
    typesToGet = typesToGet.filter(Boolean);
    var types = verifyType(typesToGet);
    if (!types) {
      res.status(400).json({ message: "Tipo no válido." });
      return;
    }
  }
  advertDB.getAdvert(typesToGet).then(advert => {
    res.send(advert);
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

verifyFieldCreation = function (advertData) {
  return new Promise((resolve, reject) => {
    var validTypes = ["lookFor", "offer"];
    if (!advertData.userId || !advertData.date || !advertData.title || !advertData.description || !advertData.places || !advertData.typeAdvert) {
      reject({ message: "Faltan datos obligatorios: userId, date, title, description, places, typeAdvert" });
    }
    if (validTypes.indexOf(advertData.typeAdvert) == -1) {
      reject({ message: "type tiene que ser uno o varios de estos valores: [lookFor, offer]" });
    }
    userDB.findUserById(advertData.userId).then(res => {
      if (res == null) {
        reject({ message: "El usuario no existe" });
      } else {
        resolve({ user: res });
      }
    }).catch(err => {
      reject({ message: "Ha habido un error: " + err.message });
    })
  });
}

createAdvertDocument = function (advertData) {
  var advert = {};
  advert['userId'] = advertData.userId;
  advert['createdAt'] = new Date().toISOString();
  advert['date'] = advertData.date;
  advert['state'] = "opened";
  advert['title'] = advertData.title;
  advert['description'] = advertData.description;
  advert['places'] = advertData.places;
  advert['premium'] = false;
  advert['typeAdvert'] = advertData.typeAdvert;
  return advert;
}

verifyType = function (typesToVerify) {
  var validTypes = ["lookFor", "offer"];
  var result = true;
  if (typesToVerify.length > 0) {
    typesToVerify.forEach(element => {
      if (validTypes.indexOf(element) == -1) {
        result = false;
      }
    });
  }
  return result;
}