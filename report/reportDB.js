var mongoose = require('mongoose');
var models = require('./models');

var Report = mongoose.model('Report', models.ReportSchema);

exports.Report = Report;

exports.saveReport = function (reportData) {
    var report = new Report(reportData);
    return new Promise((resolve, reject) => {
        report.save()
            .then(reportCreated => {
                resolve(reportCreated);
            })
            .catch(err => {
                console.log("Error saving report"+err.message)
                reject(err);
            });
    });
}