var mongoose = require('mongoose');
var models = require('./models');

var Advert = mongoose.model('Advert', models.AdvertSchema);
var usersDB = require('../users/usersDB');

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
      Advert.findByIdAndUpdate(id, { $set: { state: state } }, function (err, advert) {
        if (err) {
          reject(err);
        }
        resolve(advert);
      });
    }
  });
}

exports.modifyAdvert = function (advert, content) {
  return new Promise(function (resolve, reject) {
    if (!content.date) {
      content.date = advert.date;
    }
    if (!content.title) {
      content.title = advert.title;
    }
    if (!content.description) {
      content.description = advert.description;
    }
    if (!content.places) {
      content.places = advert.places;
    }
    Advert.findOneAndUpdate({ _id: advert._id }, {
      $set: {
        date: content.date, title: content.title,
        description: content.description, places: content.places, state: "opened"
      }
    }, { new: true },
      function (err, doc) {
        if (!err) {
          resolve(doc);
        } else {
          reject({ message: "Error modifying advert" });
        }
      });
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
        addUsersToAdvert(advert).then(added => {
          added.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          resolve(added);
        });
      });
    } else {
      Advert.find({}, (err, advert) => {
        if (err) {
          console.log("Error finding all adverts", err);
          reject(err);
        }
        addUsersToAdvert(advert).then(added => {
          added.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          resolve(added);
        });
      });
    }
  })
}

addUsersToAdvert = function (adverts) {
  return new Promise((resolve, reject) => {
    var advertArray = [];
    var itemsProcessed = 0;
    adverts.forEach((item, index, array) => {
      usersDB.User.findById(item.userId, (err, user) => {
        var advertToSent = JSON.parse(JSON.stringify(item));
        advertToSent['user'] = user;
        if (user) {
          advertToSent['user'].password = undefined;
        }
        advertArray.push(advertToSent);
        itemsProcessed++;
        if (itemsProcessed === array.length) {
          resolve(advertArray);
        }
      });
    });
  });
}

exports.findAdvertByIdUser = function (userId) {
  return new Promise(function (resolve, reject) {
    Advert.find({ userId: userId }, function (err, advert) {
      if (err) {
        console.log("Error finding advert", userId);
        reject(err);
      }
      resolve(advert);
    });
  });
}

exports.addRegisteredUser = function (advertId, userId) {
  return new Promise(function (resolve, reject) {
    Advert.findOne({
      _id: advertId
    }, function (err, advert) {
      if (err) {
        console.log("Error finding advert", advertId);
        reject(err);
      }
      else {
        Advert.updateOne({
          _id: advertId
        }, { $push: { registered: userId } },
          function (err, advert) {
            if (err) {
              console.log("Error updating advert", advertId);
              reject(err);
            }
            else resolve(advert);
          });
      }
    });
  });
}