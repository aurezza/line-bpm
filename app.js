'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var TMJStrategy = require ('tmj-passport');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var env = require('node-env-file');
const line = require('@line/bot-sdk');

const app = express();
// env files
env(__dirname + '/.env');

const port = process.env.PORT || 4000;

var handler = require('./routes/handler');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
};

const userConfig = {
  apiToken: process.env.TMJ_PASSPORT_API_TOKEN,
  url: process.env.TMJ_PASSPORT_URL_TOKEN,
  usernameField: 'username',
  passwordField: 'password'
};

// create LINE SDK client
const client = new line.Client(config);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// begin using node line bot - need raw buffer for signature validation
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cookieSession({
    name: "Test",
    keys: "fjakdljfaklljdflksj"
  }),
);

// passport
passport.use(new TMJStrategy(userConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use('/', handler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// listen on port
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

module.exports = app;
