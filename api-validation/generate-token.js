'use strict';

var ApiController = require('../controller/ApiController');

// TODO: create proper UI for generating keys
function generateToken(router) {
    router.get('/api/generate-token/:api_name', ApiController().generateToken);
}

module.exports = generateToken;