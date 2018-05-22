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

exports.findNumReports = function (id, typeReport) {
    return new Promise((resolve, reject) => {
      Report.find({
        type: typeReport,
        typeId: id
      }, function (err, reports) {
        if (err) {
          reject(err);
        }
        var numReports = reports.length;
        resolve(numReports);
      });
    });
  }