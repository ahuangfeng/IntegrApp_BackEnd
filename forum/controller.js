/**
 * Controller of forum
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var forumDB = require('./forumDB');
var userDB = require('../users/usersDB');

exports.createForum = function (req, res, next) {
  var verifyFields = verifyFieldCreation(req.body);
  if (!verifyFields.success) {
    res.status(400).json({ message: verifyFields.message });
    return;
  }
  var forumDoc = createForumDocument(req.body);
  forumDB.saveForum(forumDoc)
    .then(forum => {
      res.send(forum);
    }).catch(err => {
      res.status(400).json({ message: err.message })
    });
}

exports.getForums = function (req, res, next) {
  var types = req.query.type;
  var typesToGet = [];
  if(types != undefined){
    typesToGet = types.split(',');
    typesToGet = typesToGet.filter(Boolean);
  }
  forumDB.getForums(typesToGet).then(forums => {
    res.send(forums);
  }).catch(err => {
    res.status(400).json({ message: err.message});
  })
  // notImplemented(req, res, next);
}

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}
//TODO: FIXME: en la devolucion del parametro hay que verificar y tratar el promise!
verifyFieldCreation = function (forumData) {
  return new Promise((resolve, reject) => {
    var validTypes = ["documentation", "entertainment", "language", "various"];
    if (!forumData.title || !forumData.description || !forumData.type || !forumData.userId) {
      resolve({ success: false, message: "Faltan datos obligatorios: title, description, type, userId" });
    }
    if (validTypes.indexOf(forumData.type) == -1) {
      resolve({ success: false, message: "type tiene que ser uno o varios de estos valores: [documentation, entertainment, language, various]" });
    }
    userDB.findUserById(forumData.userId).then(res => {
      resolve({success: true});
    }).catch(err => {
      resolve({success: false, message: "El usuario no existe."});
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