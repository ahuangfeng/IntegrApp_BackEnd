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
        resolve(user);
      })
      .catch(err => {
        console.log("Error saving user: " + err.message);
        reject(err);
      })
  });
}

exports.deleteUser = function (id) {
  return new Promise(function (resolve, reject) {

    User.deleteOne({ _id: id }, function (err) {
      if (!err) {
        resolve("User deleted");
      } else {
        reject("Se ha producido un error al eliminar usuario");
      }
    });
  });
}

exports.modifyUser = function (user, content) {
  return new Promise(function (resolve, reject) {
    if (!content.username) {
      content.username = user.username;
    }
    if (!content.password) {
      content.password = user.password;
    }
    if (!content.name) {
      content.name = user.name;
    }
    if (!content.email) {
      content.email = user.email;
    }
    if (!content.phone) {
      content.phone = user.phone;
    }
    if (!content.type) {
      content.type = user.type;
      if (user.type == "association") {
        if (!content.CIF) {
          content.CIF = user.CIF;
        }
      }
      else content.CIF = "";
    }

    User.findOneAndUpdate({ _id: user.id }, {
      $set: {
        username: content.username, password: content.password,
        name: content.name, email: content.email, phone: content.phone,
        type: content.type, CIF: content.CIF
      }
    }, { new: true }, function (err, doc) {
      if (!err) {
        resolve(doc);
      } else {
        reject({ message: "Error modifying user" });
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
      Like.find({ likedUser: user._id }, function (err, likes) {
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
        var userToSend = JSON.parse(JSON.stringify(user));
        userToSend['rate'] = { likes: userLikes, dislikes: userDislikes };
        resolve(userToSend);
      });
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
        Like.find({ likedUser: id }, function (err, likes) {
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
          var userToSend = JSON.parse(JSON.stringify(user));
          userToSend['rate'] = { likes: userLikes, dislikes: userDislikes };
          resolve(userToSend);
        });
      });
    } else {
      reject({ message: "UserId no vàlido." })
    }
  });
}

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