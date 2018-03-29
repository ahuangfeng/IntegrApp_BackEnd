/**
 * Controller of users
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file

exports.createForum = function (req, res, next) {
  // res.send("Hole forums!");
  notImplemented(req,res,next);
}

notImplemented = function(req, res, next) {
  res.status(501).json({message: "Function not implemented"});
}