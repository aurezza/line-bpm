'use strict';
var Translator  = require('../service/Translator');
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
        title: Translator().get('verify.panelTitle'),
        panelTitle: Translator().get('verify.label.panelTitle'),
        verifyButtonText: Translator().get('verify.button.verify'),
        usernamePlaceholder: Translator().get('verify.placeHolder.username'),
        passwordPlaceholder: Translator().get('verify.placeHolder.password')
    }

    return renderData;
}

function successForm() {
    var successObject =  {
        title: Translator().get('verify.successTextTitle'), 
        description: Translator().get('verify.successTextMessage'),
        successButtonText: Translator().get('verify.closeWindow'),
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