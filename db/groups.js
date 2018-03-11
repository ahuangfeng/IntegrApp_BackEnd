/**
 * Created by siroramirez on 23/05/17.
 */

var db_tools = require('../tools/db_tools');
var mongoose = require('mongoose');

// database connect
var db = db_tools.getDBConexion();

// Create a Mongoose schema
var GroupSchema = new mongoose.Schema({
    name: String,
    description: String
});

// Register the schema
var Group = mongoose.model('group', GroupSchema);

exports.Group = Group;
exports.saveGroup = function(groupData) {
    var group = new Group(groupData);
    return new Promise(function(resolve, reject) {
        group.save()
            .then(group => {
                console.log("Group saved!");
                resolve(group);
            })
            .catch(err => {
                console.log("Error saving group: " + err);
                reject(err);
            })
    })
}