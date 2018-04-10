var mongoose = require('mongoose');
var models = require('./models');

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

exports.deleteUser = function(id) {
  return new Promise(function(resolve, reject) {

    User.deleteOne({_id: id}, function(err){
      if(!err) {
        resolve("User deleted");
      }else {
        reject("Se ha producido un error al eliminar usuario");
      }
    });
  });
}

exports.modifyUser = function(id, content) {
  return new Promise(function(resolve, reject) {
    User.updateOne({_id : id}, {$set: { username : content.username, password : content.password,
      name : content.name, email : content.email, phone : content.phone,
      type : content.type, CIF : content.CIF } }, function (err) {       
        if (!err) {
          resolve("User modified");
        } else {
          reject("Error modifying user");
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