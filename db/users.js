/**
 * Created by siroramirez on 23/05/17.
 */

var db_tools = require('../tools/db_tools');
var mongoose = require('mongoose');

// database connect
var db = db_tools.getDBConexion();

/**
 * @swagger
 * definitions:
 *   User:
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       admin:
 *         type: Boolean
 */
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    admin: Boolean
});

// Register the schema
var User = mongoose.model('User', UserSchema);

exports.User = User;
exports.saveUser = function (userData) {
    var user = new User(userData);
    return new Promise(function (resolve, reject) {
        user.save()
            .then(user => {
                console.log("User saved!");
                resolve(user);
            })
            .catch(err => {
                console.log("Error saving user: " + err);
                reject(err);
            })
    });
}

exports.findAllUsers = function () {
    return new Promise(function (resolve, reject) {
        User.find({}, function (err, users) {
            if (err) {
                console.log("Error finding:", err);
                reject(err)
            }
            resolve(users);
        });
    })
}

exports.findUserByName = function (name) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            username: name
        }, function (err, user) {
            if (err) {
                console.log("Error finding user", name);
                reject(err);
            }
            resolve(user);
        });
    });
}