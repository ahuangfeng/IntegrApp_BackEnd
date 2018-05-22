/**
 * Controller of users
 */
var usersDB = require('./usersDB');
var advertDB = require('../advert/advertDB');
var inscriptionDB = require('../inscription/inscriptionDB');
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file

exports.createUser = function (req, res, next) {
  var userData = req.body;

  var verify = verifyFieldsUser(userData);
  if (!verify.success) {
    res.status(400).json({ message: verify.message });
    return;
  }

  usersDB.findUserByName(userData.username).then(found => {
    if (found == null) {
      usersDB.saveUser(userData)
        .then(user => {
          res.send(user);
        }).catch(err => {
          console.log("error on saving userData:", err);
          var response = { message: err.message };
          res.status(400).json(response);
        });
    } else {
      res.status(400).json({ message: "Este username ya existe." });
    }
  }).catch(err => {
    res.status(400).json({ message: "Error en verificación de usuario duplicado: " + err.message });
  });
}

exports.getAllUsers = function (req, res, next) {
  usersDB.findAllUsers().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(400).send(err);
  });
}

exports.getUserByUsername = function (req, res, next) {
  if (!req.query.username) {
    res.status(400).json({ message: "Es necesita un username per a trobar un usuari." });
  } else {
    usersDB.findUserByName(req.query.username).then(user => {
      if (!user) {
        res.status(400).json({ message: "User not found in database" });
      } else {
        advertDB.findAdvertByIdUser(user._id).then(adverts => {
          user['adverts'] = adverts;
          var userToSend = JSON.parse(JSON.stringify(user));
          userToSend['adverts'] = adverts;
          res.send(userToSend);
        }).catch(err => {
          console.log("Error", err);
          res.status(400).send(err);
        });
      }
    }).catch(err => {
      console.log("Error", err);
      res.status(400).send(err);
    });
  }
}

exports.likeUser = function (req, res, next) {
  if (!req.params.userId) {
    res.status(400).json({ message: "Es necesita un userId per fer like" });
  } else {
    var sendUser;
    usersDB.findUserById(req.params.userId).then(userFound => {
      if (userFound) {
        usersDB.likeUser("like", req.decoded.userID, req.params.userId).then(like => {
          sendUser = JSON.parse(JSON.stringify(userFound));
          sendUser['password'] = undefined;
          return usersDB.findLikes(req.params.userId);
        }).then(rate => {
          sendUser['rate'] = JSON.parse(JSON.stringify(rate));
          res.send(sendUser);
        }).catch(err => {
          res.status(400).json({ message: err.message });
        });
      } else {
        res.status(400).json({ message: "User not found" });
      }
    }).catch(error => {
      res.status(400).json(error);
    });
  }
}

exports.dislikeUser = function (req, res, next) {
  if (!req.params.userId) {
    res.status(400).json({ message: "Es necesita un userId per fer like" });
  } else {
    var sendUser;
    usersDB.findUserById(req.params.userId).then(userFound => {
      if (userFound) {
        usersDB.likeUser("dislike", req.decoded.userID, req.params.userId).then(like => {
          sendUser = JSON.parse(JSON.stringify(userFound));
          sendUser['password'] = undefined;
          return usersDB.findLikes(req.params.userId);
        }).then(rate => {
          sendUser['rate'] = JSON.parse(JSON.stringify(rate));
          res.send(sendUser);
        }).catch(err => {
          res.status(400).json({ message: err.message });
        });
      } else {
        res.status(400).json({ message: "User not found" });
      }
    }).catch(error => {
      res.status(400).json(error);
    });
  }
}

exports.login = function (req, res) {
  usersDB.findUserByName(req.body.username).then(user => {
    if (!user) {
      res.status(401).json({ success: false, message: "Authentication failed. User not found." })
    } else if (user) {
      if (user.password != req.body.password) {
        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        const payload = {
          userID: user._id,
          username: user.username
        }
        var token = jwt.sign(payload, config.secret, {
          // expiresIn: "24h" // expires in 24 hours
        });

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  }).catch(err => {
    console.log("error:", err);
    res.status(400).send(err);
  });
}

exports.deleteUser = function (req, res, next) {
  usersDB.deleteUser(req.params.id).then(user => {
    return advertDB.deleteAdvertByUserId(user._id);
  }).then(deletedMessage => {
    // TODO: delte forums!
    res.send({ message: "Usuario eliminado y anuncios eliminados."});
  }).catch(err => {
    res.status(400).json({ message: err.message});
  });
}

exports.modifyUser = function (req, res, next) {
  var userData = req.body;

  var verify = verifyFieldsUser(userData);
  if (!verify.success) {
    res.status(400).json({ message: verify.message });
    return;
  }

  usersDB.updateUser(req.params.id, userData).then(user => {
    res.send(user);
  }).catch(err => {
    res.status(400).json({message: err.message});
  });
}


exports.getUserInfo = function (req, res, next) {
  if (!req.params.username) {
    res.status(400).json({ message: "Es necesita un username per a trobar un usuari." });
  } else {
    usersDB.findUserByName(req.params.username).then(user => {
      if (!user) {
        res.status(400).json({ message: "User not found in database" });
      } else {
        user.password = undefined;
        user.CIF = undefined;
        advertDB.findAdvertByIdUser(user._id).then(adverts => {
          var userToSend = JSON.parse(JSON.stringify(user));
          userToSend['adverts'] = adverts;
          res.send(userToSend);
        }).catch(err => {
          console.log("Error", err);
          res.status(400).send(err);
        });
      }
    }).catch(err => {
      console.log("Error", err);
      res.status(400).send(err);
    });
  }
}

exports.getUserInfoById = function (req, res, next) {
  if (!req.params.userID) {
    res.status(400).json({ message: "Es necesita un identificador per a trobar un usuari." });
  } else {
    usersDB.findUserById(req.params.userID).then(user => {
      if (!user) {
        res.status(400).json({ message: "User not found in database" });
      } else {
        user.password = undefined;
        user.CIF = undefined;
        advertDB.findAdvertByIdUser(user._id).then(adverts => {
          var userToSend = JSON.parse(JSON.stringify(user));
          userToSend['adverts'] = adverts;
          res.send(userToSend);
        }).catch(err => {
          console.log("Error", err);
          res.status(400).send(err);
        });
      }
    }).catch(err => {
      console.log("Error", err);
      res.status(400).send(err);
    });
  }
}

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

verifyFieldsUser = function (userData) {
  var validTypes = ["voluntary", "admin", "newComer", "association"];
  if (!userData.username || !userData.password || !userData.type || !userData.name) {
    return { success: false, message: "Faltan datos obligatorios: username, password, type, name" };
  }
  if (validTypes.indexOf(userData.type) == -1) {
    return { success: false, message: "type tiene que ser: [voluntary, admin, newComer, association]" };
  }
  if (userData.type == "association") {
    if (!userData.CIF) {
      return { success: false, message: "si type=association el parámetro CIF tiene que ser obligatorio" };
    }
  }
  var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
  if (!(!userData.email)) {
    if (!regex.test(userData.email)) {
      return { success: false, message: "Email mal formado" };
    }
  }

  return { success: true };
}
