'use strict';
var logger = require('../logger');
var Translator  = require('../service/Translator');
var lineBotId = process.env.LINE_BOT_CHANNEL_ID;

// setting default variables
function RenderPage() {
    if (!(this instanceof RenderPage)) return new RenderPage();
    this.lineBotId = process.env.LINE_BOT_CHANNEL_ID;
    this.translator = Translator();
}

RenderPage.prototype = {
    fetchData,
    successForm,
    errorForm
};

function fetchData(data) {
    var self = RenderPage();
    logger.info('self in render fetchData: ', self);
    console.log('self in render fetchData with console: ', self);
    var renderData = {
        error: data.error,
        errors: data.errors,
        token: data.token,
        lineID: data.lineID,
        csrfToken: data.csrfToken,
        verified: data.verified,
        customError: data.customError,
        title: self.translator.get('verify.panelTitle'),
        panelTitle: self.translator.get('verify.label.panelTitle'),
        verifyButtonText: self.translator.get('verify.button.verify'),
        usernamePlaceholder: self.translator.get('verify.placeHolder.username'),
        passwordPlaceholder: self.translator.get('verify.placeHolder.password')
    }

    return renderData;
}

function successForm() {
    var self = RenderPage();
    logger.info('self in render successForm: ', self);
    console.log('self', self);
    var successObject =  {
        title: self.translator.get('verify.successTextTitle'), 
        description: self.translator.get('verify.successTextMessage'),
        successButtonText: self.translator.get('verify.closeWindow'),
        lineBotId: lineBotId
    }

    return successObject;
}

function errorForm(data) {
    var errorObject =  {
        message: data.message,
        backButtonText: data.backButtonText,
        lineBotId: lineBotId
    }

    return errorObject;
}

module.exports = RenderPage;