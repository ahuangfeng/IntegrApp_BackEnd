/**
 * Controller of forum
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var forumDB = require('./forumDB');
var userDB = require('../users/usersDB');

exports.createForum = function (req, res, next) {
  var verifyFields = verifyFieldCreation(req.body);
  verifyFields.then(verif => {

    var forumDocument = createForumDocument(req.body);

    forumDB.saveForum(forumDocument)
      .then(forum => {
        res.send(forum);
      }).catch(err => {
        res.status(400).json({ message: err.message })
      });

  }).catch(err => {
    res.status(400).json({ message: err.message });
  });
}

exports.getForums = function (req, res, next) {
  var types = req.query.type;
  var typesToGet = [];
  if (types != undefined) {
    typesToGet = types.split(',');
    typesToGet = typesToGet.filter(Boolean);
  }
  forumDB.getForums(typesToGet).then(forums => {
    res.send(forums);
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
  // notImplemented(req, res, next);
}

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

verifyFieldCreation = function (forumData) {
  return new Promise((resolve, reject) => {
    var validTypes = ["documentation", "entertainment", "language", "various"];
    if (!forumData.title || !forumData.description || !forumData.type || !forumData.userId) {
      reject({ message: "Faltan datos obligatorios: title, description, type, userId" });
    }
    if (validTypes.indexOf(forumData.type) == -1) {
      reject({ message: "type tiene que ser uno o varios de estos valores: [documentation, entertainment, language, various]" });
    }
    userDB.findUserById(forumData.userId).then(res => {
      if (res == null) {
        reject({ message: "El usuario no existe" });
      } else {
        resolve({ user: res });
      }
    }).catch(err => {
      reject({ message: "Ha habido un error: " + err.message });
    })
  });
}

createForumDocument = function (forumData) {
  var forum = {};
  forum['title'] = forumData.title;
  forum['description'] = forumData.description;
  forum['createdAt'] = new Date().toISOString();
  forum['type'] = forumData.type;
  forum['userId'] = forumData.userId;
  forum['rate'] = 0;
  return forum;
}