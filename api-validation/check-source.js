var logger = require('../logger');
const crypto = require('crypto');
const channelSecret  = process.env.LINE_BOT_CHANNEL_SECRET;
const verify = crypto.createVerify('SHA256');

function checkSource(sourceSignature, req, res, next) {
    if (sourceSignature == req.headers['x-line-signature']) {
        logger.info('source is from line');
        const lineBody = JSON.stringify(req.body);
        const lineBodySignature = crypto.createHmac('SHA256', channelSecret).update(lineBody).digest('base64');
    
        if (lineBodySignature != sourceSignature) {
            logger.error('source from line is not valid');
            return res.send('source from line is not valid');
        }
        logger.info('body signature: ', lineBodySignature, ' is matched to line source signature'); 
        // TODO: insert api validation
        next(); 
        
    }

    if (sourceSignature == req.headers['x-origin']) {
        logger.info('source is from questetra');
        if (sourceSignature != 'questetra') {
            logger.error('source from questetra is not valid');
            return res.send('source from questetra is not valid');
        }
        logger.info('source signature is valid');
        // TODO: insert api validation
        next();
        
    }
}

module.exports =  checkSource;