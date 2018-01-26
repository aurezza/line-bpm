var passport = require('passport');
var TMJStrategy = require('tmj-passport');

function passportTmj () {
    passport.use(new TMJStrategy({
        apiToken: process.env.TMJ_PASSPORT_API_TOKEN,
        url: process.env.TMJ_PASSPORT_URL_TOKEN,
        usernameField: 'username',
        passwordField: 'password'
    }));

    return passport;
}

module.exports =  passportTmj;