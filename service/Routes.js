'use strict';

var express = require('express');
var logger = require('../logger');
var Middleware = require('../middleware/RouterMiddleware');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

var fs = require('fs');
var rootPath = require('path');
var basePath = rootPath.dirname(require.main.filename);

var ApiController = require('../controller/ApiController');
var Api = ApiController();

var VerifyPageController = require('../controller/VerifyPageController');
var Verify = VerifyPageController();

var LineController = require('../controller/LineController');
var QuestetraController = require('../controller/QuestetraController');

// TODO: create separate functions for these in middleware module
var currentMiddleware = {
    expressValidator: Verify.expressValidator(),
    csrfProtection: csrfProtection,
    setOrigin: Middleware().setOrigin,
    checkOrigin: Middleware().checkOrigin,
    tokenSyntaxError: Middleware().tokenSyntaxError,
};

function Routes () {
    if (!(this instanceof Routes)) return new Routes();
    this.router = express.Router();
}
Routes.prototype = {
    route,
    getController,
    checkMiddleware,
    checkMethodName,
    get,
    post,
    use
};

function getController(controllerPath, method) {
    var controller = require(controllerPath);
    return controller[method];
}

function checkMiddleware(middleware) {
    var middlewares = [];

    middleware.forEach(function(element) {
        if (!(element in currentMiddleware)) return logger.warn('middleware not found');
        middlewares.push(currentMiddleware[element]);
    });
    return middlewares;
}

function checkMethodName(controller) {

    var controllerArray = controller.split("@");
    var methodName = controllerArray[1];
    var methodProp = null;
    
    var controllerBaseName = controllerArray[0];
    var controllerPath = require(basePath + '/' + controllerBaseName);

    if (typeof controller == 'string') {
        var test = getController(controllerPath, methodName);
        console.log('getcontroller: ', test);
    }

    var listOfMethods = {
        // TODO: use the controller name before '@'on routes to group the following methods
        checkFormData: Verify.checkFormData.bind(Verify),
        showSuccess: Verify.showSuccess.bind(Verify),
        showPage: Verify.showPage.bind(Verify),
        generateToken: Api.generateToken.bind(Api), 
        receiverCancelledRequest: QuestetraController().receiverCancelledRequest,
        recieveFromQuest: QuestetraController().recieveFromQuest,
        eventTrigger: LineController().eventTrigger,
        corsOptions: Api.corsOptions(),
        default: function (req, res, next) {
            next();
        }
    };
    if (controller == 'default') return listOfMethods.default;
    // check if key exists then assign property
    for (var key in listOfMethods) {
        // logger.info(key, key == methodName);
        methodProp = listOfMethods[methodName];
    }
    return methodProp;
}

function route(uri, controller = 'default', middleware = [], method) {
    logger.info('initializing route...');
   
    var controllerName = checkMethodName(controller);
    var middlewares = checkMiddleware(middleware);
    var url = uri || '/'; 
    logger.info('url: ', url);
    return this.router[method](url, middlewares, controllerName);

}   
    
function get(uri, controller, middleware) {

    this.route(uri, controller, middleware, 'get');
}

function post(uri, controller, middleware) {

    this.route(uri, controller, middleware, 'post');
}

function use(middleware, controller, uri) {
    this.route(uri, controller, middleware, 'use');
}

module.exports = Routes();