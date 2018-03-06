'use strict';
var logger = require('../logger');
var localeChecker = require('../routes/locale/locale-checker');

var localeText = localeChecker('jp', 'verify-content');

// setting default variables
function RenderPage(pageData = {}) {
    this.title = localeText.panelTitle || null;
    this.panelTitle = localeText.label.panelTitle;
    this.verifyButtonText = localeText.button.verify;
    this.usernamePlaceholder = localeText.placeHolder.username;
    this.passwordPlaceholder = localeText.placeHolder.password;
    this.lineID = pageData.lineID || null;
    // this.csrfToken = pageData.req.body._csrf || null;
    // this.username = pageData.validatedUser.username || null;
    this.verified = pageData.verified || null;
    this.error = null;
    this.errors = null;
    this.customError = null;
    // this.message = localeText.errorMessageLineIdExists || null;
    // this.backButtonText = localeText.button.back || null;
}

RenderPage.prototype = {
    verifyPage: verifyPage,
    verifyForm: verifyForm,
    errorForm: errorForm
};

function verifyPage(validatedUserData) {
    var validatedUser = {
        username: validatedUserData.username
    };

    return validatedUser;
}

function verifyForm(lineID) {
    var testObject = {
        title: localeText.pageTitle.title,
        panelTitle: localeText.label.panelTitle,
        verifyButtonText: localeText.button.verify,
        usernamePlaceholder: localeText.placeHolder.username, 
        passwordPlaceholder: localeText.placeHolder.password,
        lineID: lineID,
        verified: false,
        errors: {},
        customError: ''         
    }  

    return testObject;
}

function errorForm(lineBotId) {
    var errorObject =  {
        message: localeText.errorMessageLineIdExists,
        backButtonText: localeText.button.back,
        lineBotId: lineBotId
    }

    return errorObject;
}

module.exports = RenderPage;