'use strict';
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

// locale checker
var Verify = require('../../controllers/verify-page');
var localeChecker = require('../../routes/locale/locale-checker');
var localeText = localeChecker('jp', 'verify-content');
var notEmpty = localeText.error.mustNotBeEmpty;

function verifyUser(router) {
    // needs additional validation for schema
    var verify = new Verify();
    // router.post('/verify/:token/:lineID',
    router.post('/verify/:lineID', [
        check('username', notEmpty)
            .isLength({ min: 1})
            .trim()
            .withMessage(notEmpty),

        check('password')
            .isLength({ min: 1})
            .trim().withMessage(notEmpty),
    ],
    // csrfProtection, 
    verify.checkVerifyFormData
    );
}

module.exports = verifyUser;