var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var env = require('node-env-file');

const line = require('@line/bot-sdk');

// env files
env(__dirname + '/.env');

var handler = require('./routes/handler');

// console.log("config", process.env);
const config = {
  channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

module.exports = app;
