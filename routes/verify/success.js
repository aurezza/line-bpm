'use strict';
var Verify = require('../../controllers/verify-page');
function success(router) {
    var verify = new Verify();
    router.get('/success', verify.showVerifySuccess);
}

module.exports = success;