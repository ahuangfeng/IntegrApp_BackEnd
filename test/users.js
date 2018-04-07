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
      .set('Accept', 'application/json')
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
      .get('/api/users')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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


describe('DELETE /user by id', () => {

  var userIds = [];
  before(function (done) {
    usersDB.saveUser({
      "username": "prova1",
      "password": "prova1",
      "type": "voluntary"
    }).then(response => {
      response.should.be.an('object');
      expect(response.username, "prova1");
      userIds.push(response.id);
      return usersDB.saveUser({
        "username": "prova2",
        "password": "prova2",
        "type": "voluntary"
      });
    }).then(response => {
      response.should.be.an('object');
      expect(response.username, "prova2");
      userIds.push(response.id);
      return usersDB.saveUser({
        "username": "prova3",
        "password": "prova3",
        "type": "voluntary"
      });
    }).then(response => {
      response.should.be.an('object');
      expect(response.username, "prova3");
      userIds.push(response.id);
      userIds.length.should.be.eql(3);
      done();
    }).catch(err => { 
      console.error("Error found in login tests",err);
    });
  });

  it('it should not delete anything if there is no token', (done) => {
    chai.request(server)
      .del('/api/user/'+userIds[0])
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should delete a user', (done) => {
    chai.request(server)
      .del('/api/user/'+userIds[0])
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql('User deleted');
        usersDB.findAllUsers().then(all => {
          all.should.be.an('array');
          expect(all.length, 2);
          done();
        }).catch(err => {
          console.log("ERROOS", err.message);
        });
      });
  });

  it('it should not delete any user if userId inexistant', (done) => {
    chai.request(server)
      .del('/api/user/invalid_id')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        expect(res.body.message, "UserId no vàlido.");
        usersDB.findAllUsers().then(all => {
          expect(all.length, 2);
          done();
        }).catch(err => {
          console.log("Error occurred: ", err.message);
        });
      });
  });

  it('it should delete a user', (done) => {
    chai.request(server)
      .del('/api/user/'+userIds[1])
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql('User deleted');
        usersDB.findAllUsers().then(all => {
          all.should.be.an('array');
          expect(all.length, 1);
          done();
        }).catch(err => {
          console.log("Error occurred: ", err.message);
        });
      });
  });

});