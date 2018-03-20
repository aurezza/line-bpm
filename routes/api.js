'use strict';

var express = require('express');
var router = express.Router();
var logger = require('../logger');
var kernel = require('../kernel');
var ApiController = require('../controller/ApiController');


// router.use(kernel.externalRoutes, ApiController().corsOptions(), function(req, res, next) {
//     logger.info('headers: ', JSON.stringify(req.headers));
//     // check if sources are valid
//     var sourceSignature = req.headers['x-line-signature'] || req.headers['x-origin'];

//     if (!sourceSignature) {
//         logger.error('No valid source header found');
//         return res.send('Invalid source');
//     }

//     logger.info('source is identified with: ', sourceSignature);
//     ApiController().checkSource(sourceSignature, req, res, next);
// });


router.get('/generate-token/:api_name', ApiController().generateToken);


module.exports = router;