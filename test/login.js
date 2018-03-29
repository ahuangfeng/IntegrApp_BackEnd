//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
var usersDB = require('../users/usersDB');

var username = "integrapp";
var password = "integrappTest";
var token;

chai.use(chaiHttp);
//Our parent block
describe('Login', () => {

  before(function (done) {
    usersDB.User.remove({}, (err) => { });
    usersDB.saveUser({
      "username": username,
      "password": password,
      "type": "voluntary"
    }).then(response => {
      response.should.be.an('object');
      done();
    }).catch(err => { });

  });

  describe('/login', () => {
    it('should not login with a invalid user session', function (done) {
      chai.request(server)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({ "username": username, "password": "passsss" })
        .end(function (err, res) {
          res.body.success.should.equal(false);
          res.body.message.should.equal("Authentication failed. Wrong password.");
          done();
        });
    });
  });

  describe('/login', () => {
    it('should login with a valid user session', function (done) {
      chai.request(server)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({ "username": username, "password": password })
        .end(function (err, res) {
          res.body.success.should.equal(true);
          if (res.body.success) {
            token = res.body.token;
          } else {
            token = null;
          }
          done();
        });
    });
  });

});