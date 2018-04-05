//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
var advertDB = require('../advert/advertDB');
var configTest = require('./configTest');

chai.use(chaiHttp);


describe('GET /advert', () => {

  before(function (done) {
    advertDB.Advert.remove({}, (err) => { });

    var advert = {};
    advert['userId'] = configTest.userId;
    advert['createdAt'] = new Date().toLocaleString();
    advert['date'] = new Date(2018, 6, 15, 12, 30, 0, 0).toLocaleString();
    advert['state'] = "opened";
    advert['title'] = 'Title1';
    advert['description'] = "description1";
    advert['places'] = 3;
    advert['premium'] = false;
    advert['typeUser'] = 'voluntary';
    advert['typeAdvert'] = 'lookFor';

    var advert2 = {};
    advert2['userId'] = configTest.userId;
    advert2['createdAt'] = new Date().toLocaleString();
    advert2['date'] = new Date(2018, 6, 15, 12, 40, 0, 0).toLocaleString();
    advert2['state'] = "opened";
    advert2['title'] = 'Title2';
    advert2['description'] = "description2";
    advert2['places'] = 5;
    advert2['premium'] = false;
    advert2['typeUser'] = 'voluntary';
    advert2['typeAdvert'] = 'lookFor';

    var advert3 = {};
    advert3['userId'] = configTest.userId;
    advert3['createdAt'] = new Date().toLocaleString();
    advert3['date'] = new Date(2018, 6, 15, 12, 50, 0, 0).toLocaleString();
    advert3['state'] = "opened";
    advert3['title'] = 'Title3';
    advert3['description'] = "description3";
    advert3['places'] = 10;
    advert3['premium'] = false;
    advert3['typeUser'] = 'voluntary';
    advert3['typeAdvert'] = 'offer';

    advertDB.saveAdvert(advert).then(res => {
      res.should.be.an("object");
      expect(res.state, advert.state);
      expect(res.title, advert.title);
      expect(res.premium, advert.premium);
      expect(res.description, advert.description);
      return advertDB.saveAdvert(advert2);
    }).then(response => {
      response.should.be.an("object");
      expect(response.state, advert2.state);
      expect(response.title, advert2.title);
      expect(response.premium, advert2.premium);
      expect(response.description, advert2.description);
      return advertDB.saveAdvert(advert3);
    }).then(res => {
      res.should.be.an("object");
      expect(res.state, advert3.state);
      expect(res.title, advert3.title);
      expect(res.premium, advert3.premium);
      expect(res.description, advert3.description);
      done();
    }).catch(err => {
      console.log("Error :", err.message);
    });
  });

  it('it should get all the adverts without query', function (done) {
    chai.request(server)
      .get('/api/advert')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(3);
        done();
      });
  });

  it('it should get all the adverts of type lookFor', function (done) {
    chai.request(server)
      .get('/api/advert')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .query({ type: 'lookFor' })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(2);
        done();
      });
  });

  it('it should get all the adverts of type offer', function (done) {
    chai.request(server)
      .get('/api/advert')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .query({ type: 'offer' })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });

  it('it should get all the adverts of type offer and lookFor', function (done) {
    chai.request(server)
      .get('/api/advert')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .query({ type: 'offer,lookFor' })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(3);
        done();
      });
  });

});

describe('POST /advert', () => {
  before(function (done) {
    advertDB.Advert.remove({}, (err) => { });
  });

});


