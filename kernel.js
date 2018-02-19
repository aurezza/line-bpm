'use strict';

var logger = require('./logger');

var kernelForRoutes = {
    externalRoutes: ['/receiveFromQuest', '/handler', '/verify/:lineId']
    // TODO: add internal routes
};

module.exports = kernelForRoutes;

