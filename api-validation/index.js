'use strict';

var logger = require('../logger');
var verifyToken = require('./verify-token');
var kernel = require('../kernel');
var whitelistForCors = require('../whitelist-for-cors');
var cors = require('cors');

function apiValidation(router) {
    var corsOptionsDelegate = function (req, callback) {
        var corsOptions;
        if (whitelistForCors.indexOf(req.header('Origin')) !== -1) {
          corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
        }else{
          corsOptions = { origin: false } // disable CORS for this request
        }
        callback(null, corsOptions) // callback expects two parameters: error and options
    }
    // var corsOptions = {
    //     origin: function(origin, callback) {
    //         logger.info('successfully allowed by CORS');
    //         if(whitelistForCors.indexOf(origin) !== -1) return callback(null, true);
    //         callback(new Error('Not allowed by CORS'));
    //     },
    //     // origin: ["*"], // enable for testing only
    //     headers: ["Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type", "token"],
    //     credentials: true,
    //     methods: 'GET, POST'
    // }
    // external validation
    router.use(kernel.externalRoutes, cors(corsOptionsDelegate), function(req, res, next) {
        logger.info('passing through api validation...');
        logger.info('headers: ', JSON.stringify(req.headers));

        // verify token
        var getToken = req.params.token || req.query.token || req.body.token || req.header['x-access-token'];


        verifyToken(getToken, req, res, next);
    });

    // TODO: additional error handling for other instances
    router.use(function tokenSyntaxError(err, req, res, next) {
        if (err instanceof SyntaxError) {
          logger.error("Token Not Readable: ", err.message);
          return res.status(503).send("API Validation Error");
        }
        next(err);
    });
}

module.exports = apiValidation;