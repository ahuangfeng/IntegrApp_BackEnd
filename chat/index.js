var tokenVerification = require('../middleware/tokenVerification');
const routesChat = require('./routes');
var chatDB = require('./chatDB');
var usersDB = require('../users/usersDB');

//https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender/10099325#10099325
exports.assignRoutes = function (app, server) {
  var io = require("socket.io").listen(server);
  var connectedUsers = {};

  io.sockets.on('connection', function (socket) {
    // console.log("SOCKET:", socket.id);

    socket.on('send message', function (data, to) {
      console.log("SENT MESSAGE: ", data, to);
      io.sockets.emit('new message', { msg: data, from: socket.username, to: to });
      // usersDB.findUserByName(to).then(userTo => {
      //   if(userTo){
      //   }else{

      //   }
      // }).catch(err => {
      //   console.log("Error", err);
      // });
      //TODO: Guardar mensaje en BD
      //TODO: Si el 'to' no esta en connectedUsers --> poner flag de 'new'
    });

    socket.on('new user', function (data, callback) { //TODO: podria enviarle todo el historial aqui...!
      if (data in connectedUsers) {
        callback(false);
      } else {
        usersDB.findUserByName(data).then(user => {
          if(user){
            callback(true); //TODO: Devolver historial en callback
            socket.username = data;
            socket.userId = user._id;
            connectedUsers[socket.username] = socket.id;
            // console.log("EO:", connectedUsers);
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