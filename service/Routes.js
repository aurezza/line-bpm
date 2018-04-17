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
    var url = '';
    var middlewareArgs = middleware;
    // var getMiddleware = [].slice(middlewareArgs);
    // if (middlewares.length < 0) {
    //     middlewares.push(getMiddleware);
    // }
    console.log('middlewares:', middlewares);
    var methodName = controller.split("@").pop();
    console.log('after converting: ', methodName);
    if (methodName = 'showSuccess') {
        console.log('method name: ', methodName);
        console.log('method uri: ', uri);
        var controllerName = Verify.showSuccess.bind(Verify);
        url = uri;
    }
    else if (methodName = 'showPage') {
        console.log('method name: ', methodName);
        console.log('method uri: ', uri);
        middlewares.push(csrfProtection);
        var controllerName = Verify.showPage.bind(Verify);
        url = uri;
    }
    else {
        console.log('nothing');
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