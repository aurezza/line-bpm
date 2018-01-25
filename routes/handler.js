var express = require('express');
var router = express.Router();
var verify = require('./verify');
var success = require('./success');

// verify page
verify(router);
success(router);

module.exports = router;
