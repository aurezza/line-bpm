'use strict';

var logger = require('../logger');
var verifyToken = require('./verify-token');
var kernel = require('../kernel');
var whitelistForCors = require('../whitelist-for-cors');
var cors = require('cors');

function apiValidation(router) {
    var corsOptions = {
        origin: function(origin, callback) {
            if(whitelistForCors.indexOf(origin) !== -1){
                logger.info('successfully allowed by CORS');
                return callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        // origin: ["*"], // enable for testing only
        headers: ["Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"],
        credentials: true,
        methods: 'GET, POST'
    }
    // external validation
    router.use(kernel.externalRoutes, cors(corsOptions), function(req, res, next) {
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