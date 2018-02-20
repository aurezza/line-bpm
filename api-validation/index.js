'use strict';

var logger = require('../logger');
var verifyToken = require('./verify-token');
var kernel = require('../kernel');
var whitelistForCors = require('../whitelist-for-cors');
var cors = require('cors');

function apiValidation(router) {
    var whitelist = [process.env.APP_URL, 'http://localhost:8080'];
    var corsOptions = {
        origin: function(origin, callback) {
            if(whitelist.indexOf(origin) !== -1){
                
                logger.info('successfully allowed by CORS');
                return callback(null, true);
            } else {
                logger.info(whitelist);
                logger.info(whitelist.indexOf(origin));
                logger.error('cors error');
                callback(new Error('Not allowed by CORS'));
            }
        },
        // origin: ["https://bot-dev3.tmjp.jp"], // enable for testing only
        credentials: true,
        methods: 'GET, POST'
    }

    router.use(cors(corsOptions), function(req,res, next) {
        logger.info('passed cors...');
        logger.info('request headers: ', req.headers);
        next();
    });

    router.get('/testGet', function(req, res) {
        logger.info('test get got accessed');
        res.send('testing for ');
    });

    router.put('/testPut', function(req, res) {
        logger.info('test put got accessed');
        res.send('testing for put');
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