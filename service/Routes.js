'use strict';

var express = require('express');
var logger = require('../logger');
var Middleware = require('../middleware/RouterMiddleware');

var fs = require('fs');
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
    if (controllerArray == 'default') { 
        return function (req, res, next) {
            next();
        }
    }

    var controllerDir = basePath + '/' + 'controller';
    var controllerBaseName = controllerArray[0];
    var controllerFileList = [];
    
    fs.readdirSync(controllerDir).forEach(function(file) {
        var fileNameArray = file.split(".");
        controllerFileList.push(fileNameArray[0]);
    });

    var indexOfController = controllerFileList.indexOf(controllerBaseName);

    if (indexOfController  === -1) return 'Controller does not exist';

    var controllerBasePath = controllerDir + '/' + controllerFileList[indexOfController];

    var returnedMethod = getController(controllerBasePath, methodName);

    return returnedMethod;
}

function route(uri, controller = 'default', middleware = [], method) {
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

function use(middleware, uri) {
    this.route(uri, 'default', middleware, 'use');
}

module.exports = Routes();