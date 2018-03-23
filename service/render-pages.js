'use strict';
var translator = require('../service/translator');
var lineBotId = process.env.LINE_BOT_CHANNEL_ID;

// setting default variables
function RenderPage() {
    if (!(this instanceof RenderPage)) return new RenderPage();
    this.lineBotId = process.env.LINE_BOT_CHANNEL_ID;
}

RenderPage.prototype = {
    successForm: successForm,
    errorForm: errorForm,
    fetchData: fetchData
};

function fetchData(data) {
    var renderData = {
        error: data.error,
        errors: data.errors,
        token: data.token,
        lineID: data.lineID,
        csrfToken: data.csrfToken,
        verified: data.verified,
        customError: data.customError,
        title: translator('verify.panelTitle'),
        panelTitle: translator('verify.label.panelTitle'),
        verifyButtonText: translator('verify.button.verify'),
        usernamePlaceholder: translator('verify.placeHolder.username'),
        passwordPlaceholder: translator('verify.placeHolder.password')
    }

    return renderData;
}

function successForm() {
    var successObject =  {
        title: translator('verify.successTextTitle'), 
        description: translator('verify.successTextMessage'),
        successButtonText: translator('verify.closeWindow'),
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