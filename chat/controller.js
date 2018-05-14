/**
 * Controller of chat
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

exports.chat = function (req, res, next) {
  notImplemented(req,res,next);
}