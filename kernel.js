'use strict';

var logger = require('./logger');

var kernel = {
    externalRoutes: ['/receiveFromQuest', '/handler', '/verify/:lineId']
    // TODO: add internal routes
};

module.exports = kernel;

