var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var env = require('node-env-file');
env('./.env');

var Translation = require('../../service/Translation');

describe('Translation', function() {
    it('get() should return an object', function() {      
        expect(Translation().get('message-content')).to.be.an('object');
    });
});

describe('Translation', function() {
    it('get() may also return a function', function() {      
        expect(Translation().get('scan-qr-code')).to.be.a('function');
    });
});

