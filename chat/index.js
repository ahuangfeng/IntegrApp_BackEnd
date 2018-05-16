var tokenVerification = require('../middleware/tokenVerification');
const routesChat = require('./routes');
var chatDB = require('./chatDB');
var usersDB = require('../users/usersDB');

exports.assignRoutes = function (app, server) {
  var io = require("socket.io").listen(server);
  var connectedUsers = {};

  io.sockets.on('connection', function (socket) {
    socket.on('send message', function (data, to) {
      console.log("SENT MESSAGE: ", data, to);
      io.sockets.emit('new message', { msg: data, from: socket.username, to: to });
      //TODO: Guardar mensaje en BD
      //TODO: Si el 'to' no esta en connectedUsers --> poner flag de 'new'
    });

    socket.on('new user', function (data, callback) { //TODO: podria enviarle todo el historial aqui...!
      if (data in connectedUsers) {
        callback(false);
      } else {
        usersDB.findUserByName(data).then(user => {
          if(user){
            callback(true);
            socket.username = data;
            connectedUsers[socket.username] = 1;
            updateNickNames();
          }else{
            callback(false);
          }
        }).catch(err => {
          callback(false);
        });
      }
    });

    socket.on('disconnect', function (data) {
      if (!socket.username) return;
      delete connectedUsers[socket.username];
      updateNickNames();
    });

    function updateNickNames() {
      io.sockets.emit('usernames', connectedUsers);
    }
  });

  app.use('/api', routesChat.apiRoutes);
}