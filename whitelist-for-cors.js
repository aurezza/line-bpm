'use strict';

// replace process.env.APP_URL with 'http://localhost:8080' for testing
var whitelistForCors = [process.env.APP_URL, 'http://localhost:8080'];

module.exports = whitelistForCors;