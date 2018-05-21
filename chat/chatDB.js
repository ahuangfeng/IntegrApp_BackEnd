var mongoose = require('mongoose');
var models = require('./models');

var Chat = mongoose.model('Chat', models.ChatSchema);
var usersDB = require('../users/usersDB');

exports.Chat = Chat;

exports.saveChat = function (content, fromId, toId, newFlag) {
  return new Promise((resolve, reject) => {
    createObjChat(content, fromId, toId, newFlag).then(obj => {
      var chat = new Chat(obj);
      return chat.save();
    }).then(chatCreated => {
      resolve(chatCreated);
    }).catch(err => {
      reject(err);
    });
  });
}

exports.getChatByUserId = function(userId){
  return new Promise((resolve, reject) => {
    var allChats = [];
    Chat.find({ $or: [{ from: userId }, { to: userId }]}, function(err, res){
      console.log("Chat_", res);
      res.forEach((element, index,array)=> {
        if(element.from == userId){
          if(allChats.find(x => x._id == element.to) == undefined){
            allChats.push(element.to);
          }
        }else{
          if(allChats.find( x => x._id == element.from) == undefined){
            allChats.push(element.from);
          }
        }
      });
      usersDB.findUsersByIds(allChats).then(all => {
        resolve(all);
      }).catch(err => {
        reject(err);
      });
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

createObjChat = function (content, fromId, toId, newFlag) {
  return new Promise((resolve, reject) => {
    var objSave = {
      new: newFlag,
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