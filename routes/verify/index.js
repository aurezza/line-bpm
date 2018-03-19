'use strict';
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

// locale checker
var VerifyPageController = require('../../controllers/VerifyPageController');
var localeChecker = require('../../routes/locale/locale-checker');
var localeText = localeChecker('jp', 'verify-content');
var notEmpty = localeText.error.mustNotBeEmpty;

function verify(router) {
    // needs additional validation for schema
    router.post('/verify/:token/:lineID', [
        check('username', notEmpty)
            .isLength({ min: 1})
            .trim()
            .withMessage(notEmpty),

        check('password')
            .isLength({ min: 1})
            .trim().withMessage(notEmpty),
    ],
    csrfProtection, 
    VerifyPageController().checkFormData
    );
}

module.exports = verify;