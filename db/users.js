/**
 * Created by siroramirez on 23/05/17.
 */

var db_tools = require('../tools/db_tools');
var mongoose = require('mongoose');

// database connect
var db = db_tools.getDBConexion();

// Create a Mongoose schema
var UserSchema = new mongoose.Schema({
    surname: String,
    lastname: String,
    dni: String
});

// Register the schema
var User = mongoose.model('user', UserSchema);

exports.User = User;
exports.saveUser = function(userData) {
    var user = new User(userData);
    return new Promise(function(resolve, reject) {
        user.save()
            .then(user => {
                console.log("User saved!");
                resolve(user);
            })
            .catch(err => {
                console.log("Error saving user: " + err);
                reject(err);
            })
    })
}