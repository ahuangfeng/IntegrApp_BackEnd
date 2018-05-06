//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
var reportDB = require('../report/reportDB');
var configTest = require('./configTest');

describe('POST /report', () => {

    it('it should create a report from valid data', function (done) {
        chai.request(server)
            .post('/api/report')
            .set('Accept', 'application/json')
            .set('x-access-token', configTest.token)
            .send({
                "description": "Description report",
                "type": "user",
                "typeId": "5ae1943473e4601b81e1187f",
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.an('object');
                res.body.should.have.property('description');
                res.body.should.have.property('userId');
                res.body.should.have.property('type');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('typeId');
                done();
            });
    });
});