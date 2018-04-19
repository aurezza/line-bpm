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

var Middleware = require('../middleware/RouterMiddleware');

var ApiController = require('../controller/ApiController');
var Api = ApiController();

const externalRoutes = ['/api/receiveFromQuest', '/api/handler'];

// db connection
connection(mongoose, connectionURL);

// middleware for all routes
// router.use([Middleware().setOrigin, Middleware().tokenSyntaxError]);
Routes.use(['setOrigin', 'tokenSyntaxError']);

// // middleware for external routes
// router.use(externalRoutes, Api.corsOptions(), Middleware().checkOrigin);
Routes.use(externalRoutes, 'api@corsOptions', ['checkOrigin', 'tokenSyntaxError']);

// passport
passportTmj();

// internal page
// format: '/<path name>', '<controllerName>@<method>', ['middleware']
Routes.get('/verify/:token/:line_id', 'verify@showPage', ['csrfProtection']);
Routes.post('/verify/:token/:line_id', 'verify@checkFormData', ['expressValidator', 'csrfProtection']); 
Routes.get('/success', 'verify@showSuccess');
Routes.get('/generate-token/:api_name', 'api@generateToken');

module.exports = Routes.router;