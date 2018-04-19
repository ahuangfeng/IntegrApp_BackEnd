/**
 * Controller of users
 */
var usersDB = require('./usersDB');
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file

exports.createUser = function (req, res, next) {
  var userData = req.body;

  var verify = verifyFields(userData);
  if (!verify.success) {
    res.status(400).json({ message: verify.message });
    return;
  }

  usersDB.findUserByName(userData.username).then(found => {
    if (found == null) {
      usersDB.saveUser(userData)
        .then(user => {
          res.send(user);
        })
        .catch(err => {
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
        res.send(user);
      }
    }).catch(err => {
      console.log("Error", err);
      res.status(400).send(err);
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
          userID: user.id,
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
  usersDB.findUserById(req.params.id).then(user => {
    //TODO: antes de eliminar, verificar datos asociados al usuario!
    usersDB.deleteUser(user.id).then(deletedMessage => {
      res.send({ message: deletedMessage });
    }).catch(err => {
      res.status(400).json({ message: err.message });
    });
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}

exports.modifyUser = function (req, res, next) {
  var userData = req.body;

  var verify = verifyFieldsModify(userData);
  if (!verify.success) {
    res.status(400).json({ message: verify.message });
    return;
  }

  usersDB.findUserById(req.params.id).then(user => {
    usersDB.modifyUser(user, userData).then(modifiedMessage => {
      res.send(modifiedMessage);
    }).catch(err => {
      res.status(400).json({ message: err.message });
    });
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}


exports.getUserInfo = function(req, res, next){
  if (!req.params.username) {
    res.status(400).json({ message: "Es necesita un username per a trobar un usuari." });
  } else {
    usersDB.findUserByName(req.params.username).then(user => {
      if (!user) {
        res.status(400).json({ message: "User not found in database" });
      } else {
        user.password = undefined;
        user.CIF = undefined;
        res.status(200).send(user);
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

verifyFields = function (userData) {
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
  if(!(!userData.email)) {
    if(!regex.test(userData.email)) {
      return { success: false, message: "Email mal formado"};
    }
  }
  
  return { success: true };
}

verifyFieldsModify = function (userData) {
  var validTypes = ["voluntary", "admin", "newComer", "association"];
  if(userData.type) {
    if (validTypes.indexOf(userData.type) == -1) {
      return { success: false, message: "type tiene que ser: [voluntary, admin, newComer, association]" };
    }
    if (userData.type == "association") {
      if (!userData.CIF) {
        return { success: false, message: "si type=association el parámetro CIF tiene que ser obligatorio" };
      }
    }
  }
  
  var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
  if(userData.email) {
    if(!regex.test(userData.email)) {
      return { success: false, message: "Email mal formado"};
    }
  }
  
  return { success: true };
}