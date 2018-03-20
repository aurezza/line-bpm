var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var env = require('node-env-file');
env(__dirname + '/.env');

var Translation = require('../../service/Translation');

describe('Translation', function() {
    it('translation() should return an object', function() {      
        expect(Translation().translation('message-content')).to.be.an('object');
    });
});

describe('Translation', function() {
    it('translation() may also return a function', function() {      
        expect(Translation().translation('scan-qr-code')).to.be.a('function');
    });
});

