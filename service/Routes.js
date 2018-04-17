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
    console.log('controller:', controller);
    console.log('middleware:', middleware);
    var controllerName = '';
    var middlewares = [];
    var middlewareArgs = middleware;
    var getMiddleware = [].slice(middlewareArgs);
    if (middlewares.length < 0) {
        middlewares.push(getMiddleware);
    }
    
    var methodName = controller.split("@").pop();
    if (methodName = 'verify') {
        console.log('method name: ', methodName);
        controllerName = Verify.showSuccess.bind(Verify);
    }
    else if (methodName = 'showPage') {
        console.log('method name: ', methodName);
        controllerName = Verify.showPage.bind(Verify);
    }
    else {
        console.log('nothing');
    }
    console.log('middlewares:', middlewares);
    return this.router.get(uri, middlewares, controllerName);
    // TODO: use routes function
    // this.route(uri, middleware, controller, 'get');
}

function post(uri, middleware, controller) {
    // TODO: use routes function
    // this.route(uri, middleware, controller, 'post');
}

module.exports = Routes;