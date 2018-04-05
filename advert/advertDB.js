var mongoose = require('mongoose');
var models = require('./models');

var Advert = mongoose.model('Advert', models.AdvertSchema);

exports.Advert = Advert;
exports.saveAdvert = function (advertData) {
  var advert = new Advert(advertData);
  return new Promise((resolve, reject) => {
    advert.save()
      .then(advertCreated => {
        resolve(advertCreated);
      }).catch(err => {
        console.log("Error saving advert" + err.message)
        reject(err);
      });
  });
}

exports.getAdvert = function (types) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(types)) {
      var error = { message: "Types tiene que ser un array" };
      reject(error);
    }
    if (types.length > 0) {
      var typesQuery = [];
      types.forEach(element => {
        typesQuery.push({ typeAdvert: element });
      });
      Advert.find({ $or: typesQuery }, (err, advert) => {
        if (err) {
          console.log("Error finding adverts with this types", err);
          reject(err);
        }
        resolve(advert);
      });
    } else {
      Advert.find({}, (err, advert) => {
        if (err) {
          console.log("Error finding all adverts", err);
          reject(err);
        }
        resolve(advert);
      });
    }
  })
}