'use strict';
var winston = require('winston');
var mkdirp = require('mkdirp');
var path = require('path');

var logger = new (winston.Logger) ({
    // level: 'debug',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: './logs/error.log',
            level: 'error',
            name: 'file.error',
            handleExceptions: true,
            json: false,
            timestamp: function() {
                var dateNow = new Date()
                    .toISOString()
                    .replace(/T/, ' ')
                    .replace(/\..+/, '') ;
                return dateNow;
            }
        }),
        new (winston.transports.File)({
            filename: './logs/mixed.log',
            json: false,
            level: 'info',
            name: 'file.mixed',
            json: false
        })
    ]
});

logger.on('error', function(err) {
    if (err.code == 'ENOENT') {
        mkdirp.sync(path.join(__dirname, 'logs'));
    }
});
  
// program doesn't terminate if an exception that is not caught is detected
logger.exitOnError = false; 

module.exports = logger;