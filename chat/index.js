var tokenVerification = require('../middleware/tokenVerification');
const routesChat = require('./routes');

exports.assignRoutes = function (app) {
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  io.on('connection', function(socket){
    console.log('a user connected', socket);
  });

  app.use('/api', routesChat.apiRoutes);
}