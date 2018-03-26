'use strict';

var logger = require('./logger');

var kernelForRoutes = {
    externalRoutes: ['/api/receiveFromQuest', '/api/handler']
    // TODO: add internal routes
};

module.exports = kernelForRoutes;

