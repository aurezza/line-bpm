'use strict';
var logger = require('../logger');
var localeChecker = require('../routes/locale/locale-checker');

var lineBotId = process.env.LINE_BOT_CHANNEL_ID;

// setting default variables
function RenderPage(pageData = {}) {
    if (!(this instanceof RenderPage)) return new RenderPage(pageData);

    var localeText = localeChecker('jp', 'verify-content');

    this.title = localeText.panelTitle || null;
    this.panelTitle = localeText.label.panelTitle;
    this.verifyButtonText = localeText.button.verify;
    this.usernamePlaceholder = localeText.placeHolder.username;
    this.passwordPlaceholder = localeText.placeHolder.password;

}

RenderPage.prototype = {
    successForm: successForm,
    errorForm: errorForm,
    getData: getData,
    setData: setData
};

function setData(params) {
    this.error = params.error;
    this.errors = params.errors;
    this.token = params.token;
    this.lineID = params.lineID;
    this.csrfToken = params.csrfToken;
    this.verified = params.verified;
    this.customError = params.customError;
}

function getData() {
    var renderData = {
        error: this.error,
        errors: this.errors,
        token: this.token,
        lineID: this.lineID,
        csrfToken: this.csrfToken,
        verified: this.verified,
        customError: this.customError
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