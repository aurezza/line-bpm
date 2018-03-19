var logger = require('../logger');
var verifyToken = require('./verify-token');
const crypto = require('crypto');
const channelSecret  = process.env.LINE_BOT_CHANNEL_SECRET;

function checkSource(sourceSignature, req, res, next) {
    var getToken = req.params.token || req.query.token || req.body.token || req.header['x-access-token'];

    if (sourceSignature == req.headers['x-line-signature']) {
        logger.info('source is from line');
        const lineBody = JSON.stringify(req.body);
        const lineBodySignature = crypto.createHmac('SHA256', channelSecret).update(lineBody).digest('base64');
    
        if (lineBodySignature != sourceSignature) {
            logger.info('sourceSignature: ', sourceSignature);
            logger.error('source from line is not valid');
            return res.send('source from line is not valid');
        }
        logger.info('body signature: ', lineBodySignature, ' is matched to line source signature'); 
        verifyToken(getToken, req, res, next);
        // next(); 
        
    }

    if (sourceSignature == req.headers['x-origin']) {
        logger.info('source is from questetra');
        if (sourceSignature != 'questetra') {
            logger.error('source from questetra is not valid');
            return res.send('source from questetra is not valid');
        }
        logger.info('source signature is valid');
        verifyToken(getToken, req, res, next);
        // next();
        
    }
}

module.exports =  checkSource;