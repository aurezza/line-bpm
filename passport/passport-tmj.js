var passport = require('passport');
var TMJStrategy = require('tmj-passport');

function passportTmj () {
    const userConfig = {
        apiToken: process.env.TMJ_PASSPORT_API_TOKEN,
        url: process.env.TMJ_PASSPORT_URL_TOKEN,
        usernameField: 'username',
        passwordField: 'password'
    };

    passport.use(new TMJStrategy(userConfig));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    return passport;
}

module.exports =  passportTmj;