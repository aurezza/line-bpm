'use strict';

var express = require('express');
var logger = require('../logger');
var Middleware = require('../middleware/RouterMiddleware');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

var fs = require('fs');
var rootPath = require('path');
var basePath = rootPath.dirname(require.main.filename);

// var ApiController = require('../controller/ApiController');
// var Api = ApiController;

var VerifyPageController = require('../controller/VerifyPageController');
var Verify = VerifyPageController;

// var LineController = require('../controller/LineController');
// var QuestetraController = require('../controller/QuestetraController');

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

function getController(controllerPath, methodPassed) {
    console.log('method in getController: ', methodPassed);
    var baseController = require(controllerPath);
    var controller = null;
    for (var key in baseController) {
        controller = baseController[methodPassed].bind(baseController);
        // key == methodPassed;
    }
    return controller;
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
    if (controller == 'default') { 
        return function (req, res, next) {
            next();
        }
    }

    var controllerArray = controller.split("@");
    var methodName = controllerArray[1];
    // var methodProp = null;

    // get controller
    var controllerDir = basePath + '/' + 'controller';
    var controllerBaseName = controllerArray[0];
    var controllerFileList = [];
    
    fs.readdirSync(controllerDir).forEach(function(file) {
        var fileNameArray = file.split(".");
        controllerFileList.push(fileNameArray[0]);
    });

    var lowerCaseNames = controllerFileList.map(function(value) {
        return value.toLowerCase();
    });

    for (var i = 0; i < lowerCaseNames.length; i++) {
        if (lowerCaseNames[i].match(controllerBaseName)) {
            console.log("the controller file name: ", controllerFileList[i]);
            var controllerBasePath = controllerDir + '/' + controllerFileList[i];
        }
    } 

    // if ((typeof controller == 'string')) {
    console.log('methodName inside if: ', methodName);
    var returnedMethod = getController(controllerBasePath, methodName);
    // }

    // var listOfMethods = {
    //     checkFormData: Verify.checkFormData.bind(Verify),
    //     showSuccess: Verify.showSuccess.bind(Verify),
    //     showPage: Verify.showPage.bind(Verify),
    //     generateToken: Api.generateToken.bind(Api), 
    //     receiverCancelledRequest: QuestetraController.receiverCancelledRequest,
    //     recieveFromQuest: QuestetraController.recieveFromQuest,
    //     eventTrigger: LineController.eventTrigger,
    //     corsOptions: Api.corsOptions
    // };
    
    // // check if key exists then assign property
    // for (var key in listOfMethods) {
    //     // logger.info(key, key == methodName);
    //     methodProp = listOfMethods[methodName];
    // }
    return returnedMethod;
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