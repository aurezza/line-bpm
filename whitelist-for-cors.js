'use strict';

// replace process.env.APP_URL with 'http://localhost:8080' for testing
var whitelistForCors = ['http://localhost:8080', process.env.APP_URL];

module.exports = whitelistForCors;