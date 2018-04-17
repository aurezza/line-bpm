'use strict';
var express = require('express');
var router = express.Router();
var Routes = require('../service/Routes');
var mongoose = require('mongoose');
var connection = require('../mongo/connection');
var passportTmj = require('../passport/passport-tmj');
var mongoDbURL = "mongodb://" + process.env.MONGODB_URL;
var mongoDbName = process.env.MONGODB_NAME;
const connectionURL = mongoDbURL + mongoDbName;

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

// var kernel = require('./kernel');
var Middleware = require('../middleware/RouterMiddleware');

var ApiController = require('../controller/ApiController');
var Api = ApiController();

var VerifyPageController = require('../controller/VerifyPageController');
var Verify = VerifyPageController();

const externalRoutes = ['/api/receiveFromQuest', '/api/handler'];

// db connection
connection(mongoose, connectionURL);

// middleware for all routes
router.use([Middleware().setOrigin, Middleware().tokenSyntaxError]);

// middleware for external routes
router.use(externalRoutes, Api.corsOptions(), Middleware().checkOrigin);

// passport
passportTmj();

// internal page
// router.get('/verify/:token/:line_id', csrfProtection, Verify.showPage.bind(Verify));
router.post('/verify/:token/:line_id', Verify.expressValidator(), csrfProtection, Verify.checkFormData.bind(Verify)); 
router.get('/generate-token/:api_name', Api.generateToken.bind(Api));
// router.get('/success', Verify.showSuccess.bind(Verify));

// testing for Routes service
var routeService = Routes(router);
// TODO: insert middlewares into an array
routeService.get('/verify/:token/:line_id', 'verify@showPage', ['csrfProtection']);
routeService.get('/success', 'verify@showSuccess');

module.exports = router;