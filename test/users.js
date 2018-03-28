//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../server');
let should = chai.should();
var usersDB = require('../db/users');

var username = "integrapp";
var password = "integrappTest";
var token;

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {

  // before((done) => {
  //   if (app.listening) return done();
  //   app.on('listening', function () { done(); });
  // });

  before(function (done) {
    usersDB.User.remove({}, (err) => { });
    usersDB.saveUser({
      "username": username,
      "password": password,
      "type": "voluntary"
    }).then(response => {
      response.should.be.an('object');
      done();
    }).catch(err => {

    });

  });

  describe('/login', () => {
    it('should login with a valid user user session', function (done) {
      chai.request(app)
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

  describe('/GET Users', () => {
    it('it should GET all the users', (done) => {
      chai.request(app)
        .get('/api/users').set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1);
          done();
        });
    });
  });

  describe('/POST register', () => {
    it('it should register a new user', (done) => {
      chai.request(app)
        .post('/api/register')
        .send({
          "username": "test1",
          "password": "test1",
          "type": "voluntary"
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('username');
          res.body.should.have.property('password');
          res.body.should.have.property('type');
          done();
        });
    });
  });

  describe('/GET Users', () => {
    it('it should GET all the users', (done) => {
      chai.request(app)
        .get('/api/users').set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          done();
        });
    });
  });

});