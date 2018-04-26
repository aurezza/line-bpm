'use strict';

var express = require('express');
var logger = require('../logger');
var Middleware = require('../middleware/RouterMiddleware');

var rootPath = require('path');
var basePath = rootPath.dirname(require.main.filename);

function Routes () {
    if (!(this instanceof Routes)) return new Routes();
    this.router = express.Router();
}

Routes.prototype = {
    route,
    get,
    post,
    use,
    getController,
    checkMiddleware,
    checkMethodName
};

function checkMiddleware(middleware) {
    var middlewares = [];

    middleware.forEach(function(element) {
        if (!(element in Middleware)) return logger.warn('middleware not found');
        middlewares.push(Middleware[element]);
    });

    return middlewares;
}

function getController(controllerPath, methodPassed) {
    var baseController = require(controllerPath);
    var controller = baseController[methodPassed].bind(baseController);

    return controller;
}

function checkMethodName(controller) {
    // if ((typeof controller == 'string')) {
    var controllerArray = controller.split("@");
    // }

    var methodName = controllerArray[1];
    var controllerDir = basePath + '/' + 'controller';
    var controllerBaseName = controllerArray[0];

    if (!controllerBaseName) return logger.warn(controllerBaseName, ' controller does not exist');

    var controllerBasePath = controllerDir + '/' + controllerBaseName;

    var returnedMethod = getController(controllerBasePath, methodName);

    return returnedMethod;
}

function route(uri, controller, middleware = [], method, res) {
    if (!controller) {
        logger.warn('no controller found');
        // TODO: add uri for error handling
        return res.status(422).send('No controller found - refer to admin');
    }  
    logger.info('loading route', method, 'at path:', uri);
    var controllerName = checkMethodName(controller);
    var middlewares = checkMiddleware(middleware);
    var url = uri || '/'; 

    return this.router[method](url, middlewares, controllerName);

}   
    
function get(uri, controller, middleware) {
    this.route(uri, controller, middleware, 'get');
}

function post(uri, controller, middleware) {
    this.route(uri, controller, middleware, 'post');
}

function use(middleware, uri = '/') {
    this.router.use(uri, checkMiddleware(middleware));
}

module.exports = Routes();