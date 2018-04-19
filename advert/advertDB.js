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

exports.deleteAdvert = function (id) {
  return new Promise(function (resolve, reject) {
    Advert.deleteOne({ _id: id }, function (err) {
      if (!err) {
        resolve("Advert deleted");
      } else {
        reject("Error deleting advert");
      }
    });
  });
}

// TODO: utilizar findByIdAndUpdate
// Tank.findByIdAndUpdate(id, { $set: { size: 'large' }}, { new: true }, function (err, tank) {
//   if (err) return handleError(err);
//   res.send(tank);
// });


exports.modifyStateAdvert = function (id, state) {
  return new Promise(function (resolve, reject) {
    var validValues = ['opened', 'closed'];
    if (validValues.indexOf(state) == -1) {
      reject({ message: "state no válido" });
    } else {
      Advert.findByIdAndUpdate(id, { $set: {state:state}}, function(err, advert){
        if(err) {
          reject(err);
        }
        resolve(advert);
      });
      // Advert.updateOne({ _id: id }, { $set: { state: state } }, function (err, advert) {
      //   if (err) {
      //     reject(err);
      //   }
      //   resolve(advert);
      // });
    }
  });
}

exports.findAdvertById = function (idAdvert) {
  return new Promise(function (resolve, reject) {
    if (idAdvert.match(/^[0-9a-fA-F]{24}$/)) {
      Advert.findOne({
        _id: idAdvert
      }, function (err, advert) {
        if (err) {
          console.log("Error finding advert", idAdvert);
          reject(err);
        }
        resolve(advert);
      });
    } else {
      reject({ message: "AdvertId invalid" });
    }
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

exports.findAdvertByIdUser = function (name) {
  return new Promise(function (resolve, reject) {
    Advert.find({ userId: name }, function (err, advert) {
      if (err) {
        console.log("Error finding advert", name);
        reject(err);
      }
      resolve(advert);
    });
  });
}