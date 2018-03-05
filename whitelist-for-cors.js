'use strict';

// these are the whitelisted URLS for RESPONSE origin; add 'http://localhost:8080' only for testing
var whitelistForCors = [process.env.APP_URL, 'http://localhost:8080'];

module.exports = whitelistForCors;