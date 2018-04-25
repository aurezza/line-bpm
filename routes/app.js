'use strict';
var Routes = require('../service/Routes');
var mongoose = require('mongoose');
var connection = require('../mongo/connection');
var passportTmj = require('../passport/passport-tmj');
var mongoDbURL = "mongodb://" + process.env.MONGODB_URL;
var mongoDbName = process.env.MONGODB_NAME;
const connectionURL = mongoDbURL + mongoDbName;

const externalRoutes = ['/api/receiveFromQuest', '/api/handler', '/success'];

connection(mongoose, connectionURL);

// format for use method only: ['middleware'], '<controllerName>@<method>', '/<path name>'  
Routes.use(['setOrigin', 'tokenSyntaxError']);

// TODO; move corsOptions to middleware - modify use function
Routes.use(['checkOrigin', 'tokenSyntaxError', 'corsOptions'], externalRoutes);

// passport initialize
passportTmj();

// internal pages
// format: '/<path name>', '<controllerName>@<method>', ['middleware']
Routes.get('/verify/:token/:line_id', 'verify@showPage', ['csrfProtection']);
Routes.post('/verify/:token/:line_id', 'verify@checkFormData', ['expressValidator', 'csrfProtection']); 
Routes.get('/success', 'verify@showSuccess');
Routes.get('/generate-token/:api_name', 'api@generateToken');

module.exports = Routes.router;