'use strict';
var Translator  = require('../service/Translator');
var lineBotId = process.env.LINE_BOT_CHANNEL_ID;

// setting default variables
function RenderPage() {
    if (!(this instanceof RenderPage)) return new RenderPage();
    this.lineBotId = process.env.LINE_BOT_CHANNEL_ID;
    this.translator = Translator();
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
        title: this.translator.get('verify.panelTitle'),
        panelTitle: this.translator.get('verify.label.panelTitle'),
        verifyButtonText: this.translator.get('verify.button.verify'),
        usernamePlaceholder: this.translator.get('verify.placeHolder.username'),
        passwordPlaceholder: this.translator.get('verify.placeHolder.password')
    }

    return renderData;
}

function successForm() {
    var successObject =  {
        title: this.translator.get('verify.successTextTitle'), 
        description: this.translator.get('verify.successTextMessage'),
        successButtonText: this.translator.get('verify.closeWindow'),
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