/**
 * Controller of forum
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var forumDB = require('./forumDB');
var userDB = require('../users/usersDB');

exports.createForum = function (req, res, next) {
  verifyFieldForum(req.body, req.decoded).then(verif => {
    var forumDocument = createForumDocument(req.body, req.decoded);

    forumDB.saveForum(forumDocument)
      .then(forum => {
        res.send(forum);
      }).catch(err => {
        res.status(400).json({ message: "Ha habido un error en la creación del forum :" + err.message })
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
    var types = verifyTypeForum(typesToGet);
    if (!types) {
      res.status(400).json({ message: "Tipo no válido." });
      return;
    }
  }
  forumDB.getForums(typesToGet).then(forums => {
    if (forums) {
      res.send(forums);
    } else {
      res.status(404).json({ message: "No se han encontrado forums." });
    }
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}

exports.deleteCommentforum = function(req, res, next){
  if(!req.params.id){
    res.status(400).json({ message: "Falta un id del comentario"});
  }else{
    forumDB.deleteEntry(req.params.id, req.decoded.userID).then(result => {
      res.send(result);
    }).catch(err => {
      res.status(400).send(err);
    })
  }
}

exports.commentForum = function (req, res, next) {
  verifyForumEntry(req.body, req.decoded).then(forum => {
    var forumEntryObj = createForumEntry(req.body, req.decoded);
    return forumDB.saveForumEntry(forumEntryObj);
  }).then(entry => {
    res.send(entry);
  }).catch(err => {
    res.status(400).json({ message: err.message });
  });
}

exports.getFullForum = function (req, res, next) {
  var responseToSend = {};
  if (!req.params.id) {
    res.status(400).json({ message: "Es necesita un id del forum." });
  } else {
    forumDB.findForumById(req.params.id).then(forum => {
      if (forum == null) {
        res.status(404).json({ message: "El forum no ha pogut ser trobat." })
      } else {
        responseToSend['forum'] = forum;
        forumDB.getForumEntries(forum.id).then(entries => {
          responseToSend['entries'] = entries;
          res.send(responseToSend);
        }).catch(err => {
          res.status(400).json(err);
        });
      }
    }).catch(err => {
      res.status(400).json(err);
    });
  }
}

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

verifyForumEntry = function (forumEntry, decoded) {
  return new Promise((resolve, reject) => {
    if (!forumEntry.forumId || !forumEntry.content) {
      reject({ message: "Faltan datos obligatorios: forumId, content" });
    }
    userDB.findUserById(decoded.userID).then(res => {
      if (res == null) {
        reject({ message: "El usuario no existe" });
      } else {
        return forumDB.findForumById(forumEntry.forumId);
      }
    }).then(forumRes => {
      if (forumRes == null) {
        reject({ message: "El forum no existe" });
      } else {
        resolve({ forum: forumRes });
      }
    }).catch(err => {
      reject({ message: "Ha habido un error: " + err.message });
    })
  });
}

verifyFieldForum = function (forumData, decoded) {
  // console.log("DECODED:", decoded);
  return new Promise((resolve, reject) => {
    var validTypes = ["documentation", "entertainment", "language", "various"];
    if (!forumData.title || !forumData.description || !forumData.type) {
      reject({ message: "Faltan datos obligatorios: title, description, type" });
    }
    if (validTypes.indexOf(forumData.type) == -1) {
      reject({ message: "type tiene que ser uno o varios de estos valores: [documentation, entertainment, language, various]" });
    }
    userDB.findUserById(decoded.userID).then(res => {
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

createForumDocument = function (forumData, decoded) {
  var forum = {};
  forum['title'] = forumData.title;
  forum['description'] = forumData.description;
  forum['createdAt'] = new Date().toLocaleString();
  forum['type'] = forumData.type;
  forum['userId'] = decoded.userID;
  forum['rate'] = 0;
  return forum;
}

createForumEntry = function (entry, decoded) {
  var forumEntry = {};
  forumEntry['userId'] = decoded.userID;
  forumEntry['createdAt'] = new Date().toLocaleString();
  forumEntry['content'] = entry.content;
  forumEntry['forumId'] = entry.forumId;
  return forumEntry;
}

verifyTypeForum = function (typesToVerify) {
  var validTypes = ["documentation", "entertainment", "language", "various"];
  var result = true;
  if (typesToVerify.length > 0) {
    typesToVerify.forEach(element => {
      if (validTypes.indexOf(element) == -1) {
        result = false;
      }
    });
  }
  return result;
}