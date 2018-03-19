var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai

var Translation = require('../../service/Translation');

describe('Translation', function() {
    it('translation() should return an object', function() {      
        expect(Translation().translation('jp', 'message-content')).to.be.an('object');
    });
});

describe('Translation', function() {
    it('translation() may also return a function', function() {      
        expect(Translation().translation('jp', 'scan-qr-code')).to.be.a('function');
    });
});

