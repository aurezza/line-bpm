'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var connection = require('../mongo/connection');
var passportTmj = require('../passport/passport-tmj');
var mongoDbURL = "mongodb://" + process.env.MONGODB_URL;
var mongoDbName = process.env.MONGODB_NAME;
const connectionURL = mongoDbURL + mongoDbName;


var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

var kernel = require('./kernel');
var Middleware = require('../middleware/RouterMiddleware');

var ApiController = require('../controller/ApiController');
var Api = ApiController();

var VerifyPageController = require('../controller/VerifyPageController');
var Verify = VerifyPageController();

// db connection
connection(mongoose, connectionURL);

// middleware for all routes
router.use([Middleware().setOrigin, Middleware().tokenSyntaxError]);

// middleware for external routes
router.use(kernel.externalRoutes, Api.corsOptions(), Middleware().checkOrigin);

// passport
passportTmj();

// verify page
router.get('/verify/:token/:line_id', csrfProtection, Verify.showPage.bind(Verify));
router.post('/verify/:token/:line_id', Verify.expressValidator(), csrfProtection, Verify.checkFormData.bind(Verify)); 
router.get('/success', Verify.showSuccess.bind(Verify));
router.get('/generate-token/:api_name', Api.generateToken.bind(Api));


module.exports = router;