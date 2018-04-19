'use strict';

var express = require('express');
var logger = require('../logger');
var Middleware = require('../middleware/RouterMiddleware');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

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
    checkMiddleware,
    checkMethodName,
    get,
    post,
    use
};

function checkMiddleware(middleware) {
    var middlewares = [];

    middleware.forEach(function(element) {
        if (!(element in currentMiddleware)) return logger.warn('middleware not found');
        middlewares.push(currentMiddleware[element]);
    });
    return middlewares;
}

function checkMethodName(controller) {

    var methodName = controller.split("@").pop();
    logger.info('method converted: ', methodName);

    var methodProp = null;
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
            next()
        }
    };

    // check if key exists then assign property
    for (var key in listOfMethods) {
        // logger.info(key, key == methodName);
        methodProp = listOfMethods[methodName];
    }
    return methodProp;
}

function route(uri, controller = 'default', middleware = [], method) {
    logger.info('initializing route...');
    logger.info('controller: ', controller);
    logger.info('uri: ', uri);
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

function use(uri, controller, middleware) {
    this.route(uri, controller, middleware, 'use');
}

module.exports = Routes();