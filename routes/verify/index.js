'use strict';
var Verify = require('../../controllers/verify-page');
function verify(router) {
    var verifyFunc = new Verify();
    router.get('/verify/:line_id', verifyFunc.showVerifyPage);
}

module.exports = verify;