/**
 * Created by integrapp Team
 *
 * Based on SPAM Server dvicente@solidear.es on 09/06/2016
 */
'use strict';

// packages
var express = require('express');
var bodyparser = require('body-parser');
var db_tools = require('./tools/db_tools');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('config'); // get our config file
var path = require('path');

// module.exports para que sea visible por todos los lados
var app = module.exports = express();
// use morgan to log requests to the console


if (config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('dev'));
}

// app.use(morgan('dev'));

app.set('superSecret', config.secret); // secret variable

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '10mb' }));

db_tools.DBConnectMongoose()
  .then(() => {
    var users = require('./users');
    var forums = require('./forum');
    var adverts = require('./advert');
    var inscriptions = require('./inscription');
    var swagger = require('./swagger/swagger');
    var chat = require('./chat');

    app.use('/', express.static(__dirname + '/mainPage'));
    app.use('/chat',express.static(__dirname + '/chat/public'));

    app.get('/api', function (req, res) {
      res.send("IntegrApp API Deployed!");
    });

    swagger.swaggerInit(app);

    users.assignRoutes(app);
    forums.assignRoutes(app);
    adverts.assignRoutes(app);
    inscriptions.assignRoutes(app);
    chat.assignRoutes(app);

    var port = process.env.PORT || 8080;
    app.listen(port);

    console.log('Server listening on port ' + port);
  }).catch(err => {
    console.log('Error: ' + err)
  });