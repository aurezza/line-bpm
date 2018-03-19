'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var connection = require('../mongo/connection');
var passportTmj = require('../passport/passport-tmj');
var apiValidation = require('../api-validation');
var generateToken = require('../api-validation/generate-token');
var verify = require('./verify');
var mongoDbURL = "mongodb://" + process.env.MONGODB_URL;
var mongoDbName = process.env.MONGODB_NAME;
const connectionURL = mongoDbURL + mongoDbName;


var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

var VerifyPageController = require('../controllers/VerifyPageController');
// var renderVerify = new Verify();

var LineController = require('../controller/LineController');
var QuestetraController = require('../controller/QuestetraController');
// db connection
connection(mongoose, connectionURL);

// passport
passportTmj();

// api token
apiValidation(router);
generateToken(router);

// verify page
router.get('/verify/:token/:line_id', csrfProtection, VerifyPageController().showPage);
verify(router);
router.get('/success', VerifyPageController().showSuccess);

router.post('/receiverCancelledRequest', QuestetraController().receiverCancelledRequest);
router.post('/receiveFromQuest', QuestetraController().recieveFromQuest);
router.post('/handler', LineController().eventTrigger);

module.exports = router;