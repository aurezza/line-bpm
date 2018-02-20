'use strict';

var logger = require('../logger');
var verifyToken = require('./verify-token');
var kernel = require('../kernel');
var whitelistForCors = require('../whitelist-for-cors');
var cors = require('cors');

function apiValidation(router) {
    router.use(function(req, res, next){
        // solution provided in https://github.com/expressjs/cors/issues/71
        req.headers.origin = req.headers.origin || req.headers.host;
        next();
    });
    
    var corsOptions = {
       origin: function(origin, callback) {
            logger.info("origin: ", origin);
            var whiteList = whitelistForCors.find(function(listedUrl) {
                return listedUrl.includes(origin);
            });
            logger.info("whiteList: ", whiteList);
            logger.info("whitelistForCors: ", whitelistForCors);
            logger.info("indesof origin: ", whitelistForCors.indexOf(origin));
            logger.info("result: ", whitelistForCors.indexOf(origin) !== -1);
            if(whiteList){
                logger.info('successfully allowed by CORS');
                return callback(null, true);
            } 
            logger.error('cors error');
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: 'GET, POST'
    }

    router.get('/testGet', function(req, res) {
        res.send("test get");
    });

    router.put('/testPut', function(req, res) {
        res.send("test put");
    });

    router.use(cors(corsOptions), function(req, res, next) {
        logger.info('passed cors...');
        logger.info('request headers: ', req.headers);
        next();
    });

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