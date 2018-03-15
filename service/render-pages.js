'use strict';
var logger = require('../logger');
var localeChecker = require('../routes/locale/locale-checker');

var lineBotId = process.env.LINE_BOT_CHANNEL_ID;

// setting default variables
function RenderPage(pageData = {}) {
    var localeText = localeChecker('jp', 'verify-content');
    this.title = localeText.panelTitle || undefined;
    this.panelTitle = localeText.label.panelTitle;
    this.verifyButtonText = localeText.button.verify;
    this.usernamePlaceholder = localeText.placeHolder.username;
    this.passwordPlaceholder = localeText.placeHolder.password;
    // this.lineID = null;
    // this.csrfToken = null;
    // this.username = null;
    // this.verified =  null;
    this.error = undefined;
    this.errors = undefined;
    // this.customError = null;

    if (!(this instanceof RenderPage)) return new RenderPage();
}

RenderPage.prototype = {
    successForm: successForm,
    errorForm: errorForm
};

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