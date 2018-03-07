'use strict';
var Verify = require('../../controllers/verify-page');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
function verify(router) {
    var verifyFunc = new Verify();
    router.get('/verify/:token/:line_id', csrfProtection, verifyFunc.showVerifyPage);
}

module.exports = verify;