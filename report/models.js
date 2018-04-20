var mongoose = require('mongoose');

var ReportSchema = new mongoose.Schema(
    {
        description: String,
        userId: String,
        type: {
            type: String,
            enum: ['user', 'advert', 'forum']
        },
        createdAt: String,
        typeId: String
    }
);

exports.ReportSchema = ReportSchema;