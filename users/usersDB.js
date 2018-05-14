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
var Like = mongoose.model('Like', models.LikesSchema);

exports.Like = Like;
exports.User = User;

exports.saveUser = function (userData) {
  var user = new User(userData);
  return new Promise(function (resolve, reject) {
    user.save()
      .then(user => {
        var sendingUser = JSON.parse(JSON.stringify(user));
        sendingUser['rate'] = { likes: 0, dislikes: 0 };
        resolve(sendingUser);
      })
      .catch(err => {
        console.log("Error saving user: " + err.message);
        reject(err);
      })
  });
}

exports.deleteUser = function (id) {
  return new Promise(function (resolve, reject) {
    User.findOneAndRemove({ _id: id }, function (err,doc) {
      if(err){
        reject("Se ha producido un error al eliminar usuario");
      }
      resolve(doc);
    });
  });
}

exports.updateUser = function (userId, userData){
  return new Promise((resolve, reject) => {
    User.findById(userId, function(err, user){
      user["username"] = userData["username"];
      user["password"] = userData["password"];
      user["name"] = userData["name"];
      user["phone"] = userData["phone"];
      user["type"] = userData["type"];
      user["email"] = userData["email"];
      if(userData['type'] == "association"){
        user["CIF"] = userData['CIF'];
      }else{
        user["CIF"] = undefined;
      }
      user.save(function(err, doc){
        if(err){
          reject(err);
        }
        resolve(doc);
      });
    });
  });
}

exports.findAllUsers = function () { 
  return new Promise(function (resolve, reject) {
    User.find({}, function (err, users) {
      if (err) {
        console.log("Error finding:", err);
        reject(err);
      }
      var usersToSent = [];
      var itemsProcessed = 0;
      users.forEach((item, index, array) => {
        var currentUser = JSON.parse(JSON.stringify(item));
        this.findLikes(item._id).then(rate => {
          currentUser['rate'] = rate;
          usersToSent.push(currentUser);
          itemsProcessed++;
          if (itemsProcessed === array.length) {
            resolve(usersToSent);
          }
        }).catch(err => {
          reject({message: "ha habido un error al poner los likes :" + err.message});
        });
      })
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
      if (user) {
        this.findLikes(user._id).then(rate => {
          var userToSend = JSON.parse(JSON.stringify(user));
          userToSend['rate'] = rate;
          resolve(userToSend);
        });
      } else {
        resolve(user);
      }
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
        if (user) {
          this.findLikes(id).then(rate => {
            var userToSend = JSON.parse(JSON.stringify(user));
            userToSend['rate'] = rate;
            resolve(userToSend);
          });
        } else {
          resolve(user);
        }
      });
    } else {
      reject({ message: "UserId no vàlido." })
    }
  });
}

findLikes = function (userId) {
  return new Promise((resolve, reject) => {
    Like.find({ likedUser: userId }, function (err, likes) {
      if (err) {
        reject(err);
      }
      var userLikes = 0;
      var userDislikes = 0;
      likes.forEach(like => {
        if (like.type == "like") {
          userLikes++;
        } else {
          userDislikes++;
        }
      });
      var rate = { likes: userLikes, dislikes: userDislikes };
      resolve(rate);
    });
  });
}
exports.findLikes = findLikes;

exports.likeUser = function (type, userId, likedUser) {
  return new Promise(function (resolve, reject) {
    Like.findOne({ userId: userId, likedUser: likedUser }, function (err, like) {
      if (err) {
        reject(err);
      }
      if (like) {
        if (type == like.type) {
          resolve(like);
        } else {
          Like.findByIdAndUpdate(like._id, { $set: { type: type } }, { new: true }, function (err, res) {
            if (err) {
              reject(err);
            }
            resolve(res);
          });
        }
      } else {
        var likeObj = new Like({ type: type, userId: userId, likedUser: likedUser });
        likeObj.save().then(likeResult => {
          resolve(likeResult);
        }).catch(error => {
          reject(error);
        });
      }
    });
  });
}