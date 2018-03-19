'use strict';

var logger = require('../logger');
var whitelistForCors = require('../whitelist-for-cors');

function Api () {
    if (!(this instanceof Api)) return new Api();
}

Api.prototype = {
    corsOptions
};

function corsOptions() {
    var customCorsOptions = {
        origin: function(origin, callback) {
            logger.info("origin: ", origin);
            var whiteList = whitelistForCors.find(function(listedUrl) {
                return listedUrl.includes(origin);
            });
    
            if (whiteList) {
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

    return customCorsOptions;
}

module.exports = Api;
