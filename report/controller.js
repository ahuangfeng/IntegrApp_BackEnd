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

    verify.then(verif => {
        var reportDoc = createReportDocument(reportData, req.decoded);

        reportDB.saveReport(reportDoc).then(report => {
            res.send(report);
        }).catch (err => {
            res.status(400).json({message: "error en saving report: " + err.message});
        })
    }).catch(err => {
        res.status(400).json({message: err.message});
    });
}

createReportDocument = function (reportData, decoded) {
    var report = {};
    report['description'] = reportData.description;
    report['userId'] = decoded.userID;
    report['type'] = reportData.type;
    report['createdAt'] = new Date().toLocaleString();
    report['typeId'] = reportData.typeId;
    return report;
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
            if (res == null) reject({message: "el usuario no existe"});
            else resolve({user: res});
        }).catch (err => {
            reject({ message: "Ha habido un error: " + err.message });
        })

        if (reportData.type == "advert") {
            advertDB.findAdvertById(reportData.typeId).then(res => {
                if (res == null) reject({message: "el advert con id=typeId no existe"});
                else resolve({advert: res});
            }).catch (err => {
                reject({message: "Ha habido un error: " + err.message});
            })
        } else if (reportData.type == "forum") {
            forumDB.findForumById(reportData.typeId).then(res => {
                if (res == null) reject({message: "el forum con id=typeId no existe"})
                else resolve({user: res});
            }).catch (err => {
                reject({message: "Ha habido un error: " + err.message});
            })
        } else if (reportData.type == "user") {
            userDB.findUserById(reportData.typeId).then(res => {
                if (res == null) reject({message: "el user con id=typeId no existe"});
                else resolve({user: res});
            }).catch (err => {
                reject({message: "Ha habido un error: " + err.message});
            });
        }
    });
}