var express = require('express');
var router = express.Router();
var verify = require('./line/verify');
var success = require('./line/success');

// verify page
verify(router);
success(router);

module.exports = router;
