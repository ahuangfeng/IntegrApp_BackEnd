/**
 * Created by siroramirez on 23/05/17.
 */

// var db_tools = require('../tools/db_tools');
var mongoose = require('mongoose');
var models = require('./models');

// database connect
// var db = db_tools.getDBConexion();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Usuario del sistema
 */

// Register the schema
var User = mongoose.model('User', models.UserSchema);

exports.User = User;
exports.saveUser = function (userData) {
  var user = new User(userData);
  return new Promise(function (resolve, reject) {
    user.save()
      .then(user => {
        resolve(user);
      })
      .catch(err => {
        console.log("Error saving user: " + err.message);
        reject(err);
      })
  });
}

exports.deleteUser = function(_id) {
  return new Promise(function(resolve, reject) {
    User.deleteOne({_id: _id}, function(err){
      if(!err) {
        resolve("Deleted");
      }
      else {
        reject("Error deleting");
      }
    });
  });
}

exports.findAllUsers = function () {
  return new Promise(function (resolve, reject) {
    User.find({}, function (err, users) {
      if (err) {
        console.log("Error finding:", err);
        reject(err)
      }
      resolve(users);
    });
  })
}

exports.findUserByName = function (name) {
  return new Promise(function (resolve, reject) {
    User.findOne({
      username: name
    }, function (err, user) {
      if (err) {
        console.log("Error finding user", name);
        reject(err);
      }
      resolve(user);
    });
  });
}

exports.findUserById = function (id) {
  return new Promise(function (resolve, reject) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) { //verifica que la id es vàlida
      User.findById(id, function (err, user) {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    }else{
      reject({message: "UserId no vàlido."})
    }
  });
}