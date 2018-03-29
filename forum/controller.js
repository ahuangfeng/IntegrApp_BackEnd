/**
 * Controller of forum
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var forumDB = require('./forumDB');

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

verifyFieldCreation = function (forumData) {
  var validTypes = ["documentation", "entertainment", "language", "various"];
  if (!forumData.title || !forumData.description || !forumData.type || !forumData.userId) {
    return { success: false, message: "Faltan datos obligatorios: title, description, type, userId" };
  }
  if (validTypes.indexOf(forumData.type) == -1) {
    return { success: false, message: "type tiene que ser uno o varios de estos valores: [documentation, entertainment, language, various]" }
  }
  return { success: true };
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