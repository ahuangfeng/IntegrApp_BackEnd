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

describe('POST /forum', () => {
  
  it('it should create a forum from valid data', function (done) {
    chai.request(server)
      .post('/api/forum')
      .set('Accept', 'application/json')
      .send({
        "title": "Title from forum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ex mauris. Integer pulvinar aliquam placerat. Morbi in mi nec augue condimentum gravida. Sed nulla turpis, luctus in vehicula id, posuere sed lectus. Sed odio nibh, condimentum tempor congue quis, tincidunt ut justo. Sed tincidunt cursus massa quis lobortis. ",
        "type": "documentation",
        "userId": configTest.userId
      })
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.an('object');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('type');
        res.body.should.have.property('userId');
        res.body.should.have.property('rate');
        res.body.should.have.property('createdAt');
        done();
      });
  });

  it('it should not create a forum from invalid data', function (done) {
    chai.request(server)
      .post('/api/forum')
      .set('Accept', 'application/json')
      .send({
        "title": "Title from forum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ex mauris. Integer pulvinar aliquam placerat. Morbi in mi nec augue condimentum gravida. Sed nulla turpis, luctus in vehicula id, posuere sed lectus. Sed odio nibh, condimentum tempor congue quis, tincidunt ut justo. Sed tincidunt cursus massa quis lobortis. ",
      })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should not create a forum from invalid userId', function (done) {
    chai.request(server)
      .post('/api/forum')
      .set('Accept', 'application/json')
      .send({
        "title": "Title from forum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ex mauris. Integer pulvinar aliquam placerat. Morbi in mi nec augue condimentum gravida. Sed nulla turpis, luctus in vehicula id, posuere sed lectus. Sed odio nibh, condimentum tempor congue quis, tincidunt ut justo. Sed tincidunt cursus massa quis lobortis. ",
        "type": "documentation",
        "userId": "InvalidId"
      })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should not create a forum from invalid type [documentation, entertainment, language, various]', function (done) {
    chai.request(server)
      .post('/api/forum')
      .set('Accept', 'application/json')
      .send({
        "title": "Title from forum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ex mauris. Integer pulvinar aliquam placerat. Morbi in mi nec augue condimentum gravida. Sed nulla turpis, luctus in vehicula id, posuere sed lectus. Sed odio nibh, condimentum tempor congue quis, tincidunt ut justo. Sed tincidunt cursus massa quis lobortis. ",
        "type": "invalidType",
        "userId": configTest.userId
      })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });
});

describe('GET /forum', () => {

  before(function (done) {
    //TODO: should create different types of forum to test
    done();
  });
  
  it('it should get all the forum', function (done) {
    chai.request(server)
      .get('/api/forum')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });

  it('it should not get forums for a not valid type', function (done) {
    chai.request(server)
      .get('/api/forum')
      .query({ type: 'notValid' })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property("message");
        done();
      });
  });

  it('it should get only the forum for type "entertainment"', function (done) {
    chai.request(server)
      .get('/api/forum')
      .query({ type: 'entertainment' })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        //TODO: test that all types are entertainment
        done();
      });
  });

  it('it should get the forum for type "entertainment" AND "documentation"', function (done) {
    chai.request(server)
      .get('/api/forum')
      .query({ type: 'entertainment,documentation' })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        //TODO: test that all types are entertainment
        done();
      });
  });

});