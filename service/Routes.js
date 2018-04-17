'use strict';

var logger = require('../logger');
var Middleware = require('../middleware/RouterMiddleware');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

var VerifyPageController = require('../controller/VerifyPageController');
var Verify = VerifyPageController();

function Routes (router) {
    if (!(this instanceof Routes)) return new Routes(router);
    this.router = router;
}
Routes.prototype = {
    // router,
    get,
    post
};

// function route(uri, controller, middleware, method, res) {
//     logger.info('route params: ', uri, controller, middleware, method);
//     // 
//     if (environment != 'production') {
//         logger.info('local environment');
//         const envUrl = 'http://localhost/';
//         const newPath = envUrl + port + uri;
//         logger.info('newPath', newPath);
//         return res.send(newPath);
//     }
//     return true;
// }   

// be able to use own Router.get instead of using express routers
function get(uri, controller, middleware) {
    logger.info('controller:', controller);
    logger.info('middleware:', middleware);
    
    var url = '';
    var controllerName = '';
    var middlewares = [];
    // list of known middlewares
    // TODO: create separate functions for these in middleware module
    var currentMiddleware = {
        expressValidator: Verify.expressValidator(),
        csrfProtection: csrfProtection
    };
   
    if (middleware) {
        middleware.forEach(function(element) {
            if (element in currentMiddleware) {
                logger.info('middleware found');
                middlewares.push(currentMiddleware[element]);
            } else {
                logger.warn('middleware does not found');
            }
        });
    }
    logger.info('middlewares:', middlewares);
    var methodName = controller.split("@").pop();
    logger.info('after converting: ', methodName);
    if (methodName == 'showSuccess') {
        logger.info('method name: ', methodName);
        logger.info('this is a test ------ show success func');
        logger.info('method uri: ', uri);
        var controllerName = Verify.showSuccess.bind(Verify);
        url = uri;
    }

    if (methodName == 'showPage') {
        logger.info('method name: ', methodName);
        logger.info('method uri: ', uri);
        logger.info('this is a test ------ show page func');
        var controllerName = Verify.showPage.bind(Verify);
        url = uri;
    }

    return this.router.get(url, middlewares, controllerName);
    
    // TODO: use routes function
    // this.route(uri, middleware, controller, 'get');
}

function post(uri, middleware, controller) {
    // TODO: use routes function
    // this.route(uri, middleware, controller, 'post');
}

module.exports = Routes;