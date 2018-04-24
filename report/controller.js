// Controller of report

var config = require('config');
var reportDB = require('./reportDB');
var jwt = require('jsonwebtoken');
var userDB = require('../users/usersDB');
var advertDB = require('../advert/advertDB');
var forumDB = require('../forum/forumDB');

exports.createReport = function (req, res, next) {
    var reportData = req.body;

    var verify = verifyFieldsReport(reportData, req.decoded);

}

verifyFieldsReport = function (reportData, decoded) {
    return new Promise((resolve, reject) => {
        var validTypes = ["user", "advert", "forum"];

        if (!reportData.description || !reportData.type) {
            reject({message: "faltan datos obligatorios: description, type"});
        }

        if (validTypes.indexOf(reportData.type) == -1) {
            reject({message: "type tiene que ser uno de estos valores: [user, advert, forum]"});
        }

        userDB.findUserById(decoded.userID).then(res => {
            if (res == null) {
                reject({message: "el usuario no existe"});
            }
            else {
                if (reportData.type == "advert") {
                    advertDB.findAdvertById(reportData.typeId).then(res => {
                        if (res == null) {
                            reject({message: "el id del advert no existe"});
                        }
                    })
                } else if (reportData.type == "forum") {
                    
                }
            }
        })

    })



}