var tokenVerification = require('../middleware/tokenVerification');
const routesChat = require('./routes');

exports.assignRoutes = function (app) {
  var server = require('http').createServer(app);
  var io = require("socket.io").listen(server);
  var nicknames = {};

  io.sockets.on('connection', function (socket) {
    socket.on('send message', function (data) {
      io.sockets.emit('new message', { msg: data, nick: socket.nickname });
    });

    socket.on('new user', function (data, callback) {
      if (data in nicknames) {
        callback(false);
      } else {
        callback(true);
        socket.nickname = data;
        nicknames[socket.nickname] = 1;
        updateNickNames();
      }
    });

    socket.on('disconnect', function (data) {
      if (!socket.nickname) return;
      delete nicknames[socket.nickname];
      updateNickNames();
    });

    function updateNickNames() {
      io.sockets.emit('usernames', nicknames);
    }
  });

  app.use('/api', routesChat.apiRoutes);
}