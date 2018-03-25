/**
 * Created by siroramirez on 23/05/17.
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
var config = require('./config.js'); // get our config file

var app = express();
// use morgan to log requests to the console
app.use(morgan('dev'));

app.set('superSecret', config.secret); // secret variable

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '10mb' }));

db_tools.DBConnectMongoose()
    .then(() => {
        var routes = require('./routes/routes');
        var swagger = require('./swagger/swagger');
        app.get('/', function (req, res) {
            res.send("IntegrApp Back-End Deployed!");
        });

        swagger.swaggerInit(app);

        routes.assignRoutes(app);
        var port = process.env.PORT || 8080;
        app.listen(port);

        console.log('Server listening on port ' + port);
    })
    .catch(err => {
        console.log('Error: ' + err)
    });