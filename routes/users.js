/**
 * Created by siroramirez on 23/05/17.
 */
var usersDB = require('../db/users');
var jwt = require('jsonwebtoken');
var config = require('../config.js'); // get our config file

exports.createUser = function (req, res, next) {
    var userData = req.body;

    var verify = verifyFields(userData);
    if (!verify.success) {
        res.status(400).send({ message: verify.message });
        return;
    }

    usersDB.saveUser(userData)
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            console.log("error on saving userData:", err);
            var response = { message: err.message };
            res.status(400).send(response);
        });
}

exports.getAllUsers = function (req, res, next) {
    usersDB.findAllUsers().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(400).send(err);
    });
}

exports.login = function (req, res) {
    usersDB.findUserByName(req.body.username).then(user => {
        if (!user) {
            res.json({ success: false, message: "Authentication failed. User not found." })
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload = {
                    admin: user.admin
                };
                var token = jwt.sign(payload, config.secret, {
                    // expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    }).catch(err => {
        console.log("erro:", err);
        res.status(400).send(err);
    });
}

verifyFields = function (userData) {
    var validTypes = ["voluntary", "admin", "newComer", "association"];
    if (!userData.username || !userData.password || !userData.type) {
        return { success: false, message: "Faltan datos obligatorios: username, password, type" };
    }
    if (validTypes.indexOf(userData.type) == -1) {
        return { success: false, message: "type tiene que ser: [voluntary, admin, newComer, association]" };
    }
    if (userData.type == "association") {
        if (!userData.CIF) {
            return { success: false, message: "si type=association el parámetro CIF tiene que ser obligatorio" };
        }
    }
    return { success: true };
}