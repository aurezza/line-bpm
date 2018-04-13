'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var appPath = path.dirname(require.main.filename);
var logger = require('../logger');
var Translator  = require('../service/Translator');
var Middleware = require('../middleware/RouterMiddleware');

function Routes () {
    if (!(this instanceof Routes)) return new Routes();
}

Routes.prototype = {
    route: route,
    get: get,
    post: post
};

function route(uri, controller, middleware, method) {
    logger.info('params: ', uri, controller, middleware, method);
    return true;
}   

// be able to use own Router.get instead of using express routers

function get(uri, middleware, controller) {
    Routes.route(uri, middleware, controller, 'get');
}

function post(uri, middleware, controller) {
    Routes.route(uri, middleware, controller, 'post');
}

module.exports = Routes;