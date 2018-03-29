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

describe('Users', () => {
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

  describe('/GET Users', () => {
    it('it should GET a 403 response caused by not having token', (done) => {
      chai.request(server)
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.an('object');
          res.body.should.have.property('success');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe('/GET Users without token', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
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
      chai.request(server)
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

  describe('/GET Users (2 users created)', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
        .get('/api/users').set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          done();
        });
    });
  });

  describe('/POST register with wrong parameters', () => {
    it('it should not register user and responding with an error message', (done) => {
      chai.request(server)
        .post('/api/register')
        .send({
          "username": "test2",
          "password": "test2"
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe('/POST register association', () => {
    it('it should respond with an error', (done) => {
      chai.request(server)
        .post('/api/register')
        .send({
          "username": "test2",
          "password": "test2",
          "type": "association"
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          expect(res.body.message, "si type=association el parámetro CIF tiene que ser obligatorio");
          done();
        });
    });
  });

  describe('/POST register user with missing fields', () => {
    it('it should respond with an error', (done) => {
      chai.request(server)
        .post('/api/register')
        .send({
          "username": "test2",
          "type": "association"
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          expect(res.body.message, "Faltan datos obligatorios: username, password, type");
          done();
        });
    });
  });

});