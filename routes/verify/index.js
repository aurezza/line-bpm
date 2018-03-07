'use strict';
var Verify = require('../../controllers/verify-page');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var express = require('express');
const app = express();
function verify(router) {
    var verifyFunc = new Verify();
    console.log('vefiry index is up');
    app.get('/verify/:token/:line_id', csrfProtection, verifyFunc.showVerifyPage);
}

module.exports = verify;