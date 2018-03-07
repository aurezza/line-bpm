'use strict';
var Verify = require('../../controllers/verify-page');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var express = require('express');
const app = express();
function verify(router) {
    var verifyFunc = new Verify();
    console.log('vefiry index is up');
    // router.get('/verify/:token/:line_id', csrfProtection, verifyFunc.showVerifyPage);
    router.get('/verify/:token/:line_id', function (req, res) {
        res.send('verify test');
    });
}

module.exports = verify;