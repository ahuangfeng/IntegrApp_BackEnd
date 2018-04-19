var mongoose = require('mongoose');
var models = require('./models');

var Report = mongoose.model('Report', models.ReportSchema);

exports.Report = Report;

exports.saveReport = function (reportData) {
    
}