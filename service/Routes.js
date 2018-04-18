'use strict';

var logger = require('../logger');
var Middleware = require('../middleware/RouterMiddleware');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

var ApiController = require('../controller/ApiController');
var Api = ApiController();

var VerifyPageController = require('../controller/VerifyPageController');
var Verify = VerifyPageController();

function Routes (router) {
    if (!(this instanceof Routes)) return new Routes(router);
    this.router = router;
}
Routes.prototype = {
    route,
    checkMiddleware,
    checkMethodName,
    get,
    post
};

// TODO: create separate functions for these in middleware module
var currentMiddleware = {
    expressValidator: Verify.expressValidator(),
    csrfProtection: csrfProtection
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
    logger.info('after converting: ', methodName);

    var methodProp = null;
    var listOfMethods = {
        checkFormData: Verify.checkFormData.bind(Verify),
        showSuccess: Verify.showSuccess.bind(Verify),
        showPage: Verify.showPage.bind(Verify),
        generateToken: Api.generateToken.bind(Api)
    };

    for (var key in listOfMethods) {
        console.log(key, key == methodName);
        methodProp = listOfMethods[methodName];
    }
    return methodProp;
}

function route(uri, controller, middleware, method) {
    logger.info('controller:', controller);
    logger.info('middleware:', middleware);
    logger.info('uri: ', uri);
    logger.info('method: ', method);

    var controllerName;
    var middlewares = [];

    // eliminate if method by either: this.router[method](); or by object

    if (middleware) {
        checkMiddleware(middleware);
    }
    controllerName = checkMethodName(controller);

    return this.router[method](uri, middlewares, controllerName);

    // if (method == 'post') {
    //     if (middleware) {
    //         checkMiddleware(middleware);
    //     }
    //     controllerName = checkMethodName(controller);

    //     return this.router.post(uri, middlewares, controllerName);
    // }

    // if (method == 'get') {
    //     if (middleware) {
    //         checkMiddleware(middleware);
    //     }
        
    //     controllerName = checkMethodName(controller);
        
    //     return this.router.get(uri, middlewares, controllerName);
    // }
}   
    
function get(uri, controller, middleware) {
    
    this.route(uri, controller, middleware, 'get');
}

function post(uri, controller, middleware) {

    this.route(uri, controller, middleware, 'post');
}

module.exports = Routes;