'use strict';
var logger = require('../logger');
var localeChecker = require('../routes/locale/locale-checker');

var localeText = localeChecker('jp', 'verify-content');

// setting default variables
function VerifyPage(pageData = {}) {
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
}

VerifyPage.prototype = {
    verifyPage: verifyPage,
    test: test
};

function verifyPage(validatedUserData) {
    var validatedUser = {
        username: validatedUserData.username
    };

    return validatedUser;
}

function test(lineId) {
    var lineID = lineId;

    return lineID;
}

module.exports = VerifyPage;