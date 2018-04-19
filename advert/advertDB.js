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

exports.modifyStateAdvert = function (id, state) {
  return new Promise(function (resolve, reject) {
      Advert.updateOne({ _id : id}, {$set: { state : state} }, function (err) {       
        if (!err) {
          resolve("State of Advert modified");
        } else {
          reject("Error modifying state of advert");
        }
      });
  });
}

exports.modifyAdvert = function(advert, content) {
  return new Promise(function(resolve, reject) {
    if(!content.date) {
      content.date = advert.date;
    }
    if(!content.title) {
      content.title = advert.title;
    }
    if(!content.description) {
      content.description = advert.description;
    }
    if(!content.places) {
      content.places = advert.places;
    }
    Advert.updateOne({_id : advert._id}, {$set: { date : content.date, title : content.title,
      description : content.description, places : content.places, state : "opened"} },
       function (err) {       
        if (!err) {
          resolve("Advert modified");
        } else {
          reject("Error modifying advert");
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

exports.findAdvertByIdUser = function(name) {
  return new Promise(function (resolve, reject) {
    Advert.find({userId: name}, function(err, advert) {
      if(err) {
        console.log("Error finding advert", name);
        reject(err);
      }
      resolve(advert);
    });
  });
}