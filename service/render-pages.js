'use strict';
var logger = require('../logger');
var localeChecker = require('../routes/locale/locale-checker');

var lineBotId = process.env.LINE_BOT_CHANNEL_ID;

// setting default variables
function RenderPage() {
    if (!(this instanceof RenderPage)) return new RenderPage();
}

RenderPage.prototype = {
    successForm: successForm,
    errorForm: errorForm,
    fetchData: fetchData
};

function fetchData(data) {
    var localeText = localeChecker('jp', 'verify-content');
    
    var renderData = {
        error: data.error,
        errors: data.errors,
        token: data.token,
        lineID: data.lineID,
        csrfToken: data.csrfToken,
        verified: data.verified,
        customError: data.customError,
        title: localeText.panelTitle,
        panelTitle: localeText.label.panelTitle,
        verifyButtonText: localeText.button.verify,
        usernamePlaceholder: localeText.placeHolder.username,
        passwordPlaceholder: localeText.placeHolder.password
    }

    return renderData;
}

function successForm() {
    var localeText = localeChecker('jp', 'success-message');
    var successObject =  {
        title: localeText.successTextTitle, 
        description: localeText.successTextMessage,
        successButtonText: localeText.closeWindow,
        lineBotId: lineBotId
    }

    return successObject;
}

function errorForm() {
    var localeText = localeChecker('jp', 'verify-content');
    var errorObject =  {
        message: localeText.errorMessageLineIdExists,
        backButtonText: localeText.button.back,
        lineBotId: lineBotId
    }

    return errorObject;
}

module.exports = RenderPage;