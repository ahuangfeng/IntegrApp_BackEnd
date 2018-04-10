/**
 * Controller of forum
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var advertDB = require('./advertDB');
var userDB = require('../users/usersDB');

exports.createAdvert = function (req, res, next) {
  var verifyFields = verifyFieldAdvert(req.body, req.decoded);
  verifyFields.then(verif => {

    var advertDocument = createAdvertDocument(req.body, verif, req.decoded);

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
    var types = verifyTypeAdvert(typesToGet);
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

exports.deleteAdvert = function (req, res, next) {
  advertDB.findAdvertById(req.params.id).then(advert => {
    advertDB.deleteAdvert(advert._id).then(deleted => {
      res.send({ message: deleted });
    }).catch(err => {
      res.status(400).json({ message: err.message });
    })
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}

exports.modifyStateAdvert = function (req, res, next) {
  advertDB.findAdvertById(req.params.id).then(advert => {
    advertDB.modifyStateAdvert(advert._id, advert.state).then(modified => {
      res.send({ message: modified });
    }).catch(err => {
      res.status(400).json({ message: err.message });
    })
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}

exports.getAdvertsUser = function(req,res,next) {
  advertDB.findAdvertByIdUser(req.params.id).then(adverts => {
    if(!adverts) {
      res.status(400).json({ message: "Error with user"});
    } else {
      res.send(adverts);
    }
  }).catch(err => {
    console.log("Error", err);
    res.status(400).send(err);
  });
}

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

verifyFieldAdvert = function (advertData, decoded) {
  return new Promise((resolve, reject) => {
    var validTypes = ["lookFor", "offer"];
    if (advertData.places <= 0) {
      reject({ message: "places tiene que ser mayor que 0" });
    }
    if (!advertData.date || !advertData.title || !advertData.description || !advertData.places || !advertData.typeAdvert) {
      reject({ message: "Faltan datos obligatorios: date, title, description, places, typeAdvert" });
    }
    if (validTypes.indexOf(advertData.typeAdvert) == -1) {
      reject({ message: "type tiene que ser uno o varios de estos valores: [lookFor, offer]" });
    }

    var regex = /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/;

    if (!regex.test(advertData.date)) {
      reject({ message: "Date tiene que ser en formato YYYY-MM-DD hh:mm:ss" });
    }
    var dataAux = new Date(advertData.date).toLocaleString();
    dataAux = new Date(dataAux).getTime();

    var today = new Date().toLocaleString();
    today = new Date(today).getTime();


    if (dataAux - today < 0) {
      reject({ message: "Date tiene que ser posterior a la date actual" });
    }

    userDB.findUserById(decoded.userID).then(res => {
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

createAdvertDocument = function (advertData, user, decoded) {
  var advert = {};
  advert['userId'] = decoded.userID;
  advert['createdAt'] = new Date().toLocaleString();
  advert['date'] = new Date(advertData.date).toLocaleString();
  advert['state'] = "opened";
  advert['title'] = advertData.title;
  advert['description'] = advertData.description;
  advert['places'] = advertData.places;
  if (user.user.type == "association") advert['premium'] = true;
  else advert['premium'] = false;
  advert['typeUser'] = user.user.type;
  advert['typeAdvert'] = advertData.typeAdvert;
  return advert;
}

verifyTypeAdvert = function (typesToVerify) {
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