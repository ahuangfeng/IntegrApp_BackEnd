var mongoose = require('mongoose');
var models = require('./models');

var Chat = mongoose.model('Chat', models.ChatSchema);
var usersDB = require('../users/usersDB');

exports.Chat = Chat;

exports.saveChat = function (content, fromId, toId, newTo, newFrom) {
  return new Promise((resolve, reject) => {
    createObjChat(content, fromId, toId, newTo, newFrom).then(obj => {
      var chat = new Chat(obj);
      return chat.save();
    }).then(chatCreated => {
      resolve(chatCreated);
    }).catch(err => {
      reject(err);
    });
  });
}

exports.seenChats = function (from, to, userId) {
  return new Promise((resolve, reject) => {
    // if(userId == from){
      // Chat.find({ from: from, to: to },(err,res) => {
      //   console.log("RES:", res);
      //   res.forEach(element => {
      //     element.newTo = false;
      //     element.save();
      //   });
      //   resolve(res);
      // });
      Chat.update({ from: to, to: from }, { newTo: false }, { multi: true }, function (err, raw) {
        if (err) reject(err);
        resolve(raw);
        // console.log('The raw response from Mongo was ', raw);
      });
    // }else{
    //   resolve("nothing to update");
    // }
  });
}

exports.getChatByUserId = function (userId) {
  return new Promise((resolve, reject) => {
    var allChats = [];
    Chat.find({ $or: [{ from: userId }, { to: userId }] }, function (err, res) {
      if (err) reject(err);
      if (res.length > 0) {
        res.forEach((element, index, array) => {
          if (element.from == userId) {
            if (allChats.find(x => x._id == element.to) == undefined) {
              allChats.push(element.to);
            }
          } else {
            if (allChats.find(x => x._id == element.from) == undefined) {
              allChats.push(element.from);
            }
          }
        });
        usersDB.findUsersByIds(allChats).then(all => {
          resolve(all);
        }).catch(err => {
          reject(err);
        });
      } else {
        resolve(res);
      }
    });
  });
}

exports.getNewChat = function (userId) {
  return new Promise((resolve, reject) => {
    var newChats = 0;
    Chat.find({ $or: [{ from: userId }, { to: userId }] }, function (err, res) {
      if (err) reject(err);
      if (res.length > 0) {
        res.forEach((element, index, array) => {
          if (element.to == userId && element.newTo) {
            newChats++;
          }
        });
        resolve({ new: newChats });
      } else {
        resolve({ new: 0 });
      }
    });
  });
}

exports.getChat = function (from, to) {
  return new Promise((resolve, reject) => {
    Chat.find({ $or: [{ from: from, to: to }, { from: to, to: from }] }, function (err, res) {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

createObjChat = function (content, fromId, toId, newTo, newFrom) {
  return new Promise((resolve, reject) => {
    var objSave = {
      newFrom: newFrom,
      newTo: newTo,
      content: content,
      from: fromId,
      to: toId,
      createdAt: new Date().toDateString()
    };
    usersDB.findUserById(fromId).then(user => {
      objSave['fromUsername'] = user.username;
      return usersDB.findUserById(toId);
    }).then(userTo => {
      objSave['toUsername'] = userTo.username;
      resolve(objSave);
    }).catch(err => {
      reject(err);
    });
  });
}