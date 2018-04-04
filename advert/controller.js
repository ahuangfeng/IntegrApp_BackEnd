/**
 * Controller of forum
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var advertDB = require('./advertDB');
var userDB = require('../users/usersDB');

exports.createAdvert = function (req, res, next) {
  var verifyFields = verifyFieldAdvert(req.body);
  verifyFields.then(verif => {

    var advertDocument = createAdvertDocument(req.body, verif);

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

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

verifyFieldAdvert = function (advertData) {
  return new Promise((resolve, reject) => {
    var validTypes = ["lookFor", "offer"];
    if (!advertData.userId || !advertData.date || !advertData.title || !advertData.description || !advertData.places || !advertData.typeAdvert) {
      reject({ message: "Faltan datos obligatorios: userId, date, title, description, places, typeAdvert" });
    }
    if (validTypes.indexOf(advertData.typeAdvert) == -1) {
      reject({ message: "type tiene que ser uno o varios de estos valores: [lookFor, offer]" });
    }
    if(advertData.places <= 0) {
      reject({message: "places tiene que ser mayor que 0"});
    }

    var re = /^([1-9]|([012][0-9])|(3[01]))-([0]{0,1}[1-9]|1[012])-\d\d\d\d [012]{0,1}[0-9]:[0-6][0-9]$/;

    if(!re.test(advertData.date)) {
      reject({message: "Date tiene que ser en formato DD-MM-YYYY hh:mm"});
    }
    var dataAux = new Date(advertData.date).toLocaleString();
    dataAux = new Date(dataAux).getTime();

    var dataAct = new Date().toLocaleString();
    dataAct = new Date(dataAct).getTime();
    
    if(dataAux - dataAct < 0) {
      reject({message: "Date tiene que ser posterior a la date actual"});
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

createAdvertDocument = function (advertData, user) {
  var advert = {};
  advert['userId'] = advertData.userId;
  advert['createdAt'] = new Date().toLocaleString();
  advert['date'] = new Date(advertData.date).toLocaleString();
  advert['state'] = "opened";
  advert['title'] = advertData.title;
  advert['description'] = advertData.description;
  advert['places'] = advertData.places;
  if(user.user.type == "association") advert['premium'] = true;
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