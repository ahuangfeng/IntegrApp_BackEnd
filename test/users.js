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
var configTest = require('./configTest');

chai.use(chaiHttp);

describe('GET /users', () => {
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

  it('it should GET all the users', (done) => {
    chai.request(server)
      .get('/api/users').set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });
});

describe('POST /register', () => {
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

  it('it should not register a new user with existing username', (done) => {
    chai.request(server)
      .post('/api/register')
      .send({
        "username": "test1",
        "password": "test1",
        "type": "voluntary"
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        expect(res.body.message, "User already existing, choose another username.");
        done();
      });
  });

  it('it should not register user with missing fields', (done) => {
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

  it('it should not register a new user with a wrong type', (done) => {
    chai.request(server)
      .post('/api/register')
      .send({
        "username": "test1",
        "password": "test1",
        "type": "wrongType"
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should not register an association without his CIF', (done) => {
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

  it('it should not register a user without a password', (done) => {
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

describe('GET /user by username', () => {
  it('it should GET the existing user', (done) => {
    chai.request(server)
      .get('/api/user')
      .set('x-access-token', configTest.token)
      .query({ username: 'test1' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        expect(res.body.username, 'test1');
        done();
      });
  });

  it('it should get an error if no username provided', (done) => {
    chai.request(server)
      .get('/api/user')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        expect(res.body.message, 'Es necesita un username per a trobar un usuari.');
        done();
      });
  });

  it('it should get an error if user not found', (done) => {
    chai.request(server)
      .get('/api/user')
      .set('x-access-token', configTest.token)
      .query({ username: 'test3' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        expect(res.body.username, 'User not found in database');
        done();
      });
  });

  it('it should get an error if no token provided', (done) => {
    chai.request(server)
      .get('/api/user')
      .query({ username: 'test3' })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

});