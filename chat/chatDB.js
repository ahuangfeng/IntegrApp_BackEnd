var mongoose = require('mongoose');
var models = require('./models');

var Chat = mongoose.model('Chat', models.ChatSchema);
var usersDB = require('../users/usersDB');

exports.Chat = Chat;

exports.saveChat = function (chatData) {
  var chat = new Chat(chatData);
  return new Promise((resolve, reject) => {
    chat.save()
      .then(chatCreated => {
        resolve(chatCreated);
      }).catch(err => {
        console.log("Error saving forum" + err.message)
        reject(err);
      });
  });
}

exports.getChat = function(from, to){
  return new Promise((resolve, reject) => {
    Chat.find({from: from, to: to}, function(err, res){
      if(err){
        reject(err);
      }
      resolve(res);
    });
  });
}