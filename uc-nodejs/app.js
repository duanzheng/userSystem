var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var i18n = require('i18n');

var routes = require('./routes/index');
var user = require('./routes/user');
var kefu = require('./routes/kefu');
var config = require('./routes/config');

var app = express();

i18n.configure({
    locales: ['cn', 'tw', 'en'],
    defaultLocale: 'cn',
    directory: __dirname + '/locales',
    extension: '.js'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true
}));

app.use(i18n.init);

app.use(function (req, res, next) {
    // check if user has changed i18n settings
    if (req.session.locale) {
        i18n.setLocale(req.session.locale);
    }
    next();
    console.log("设置语言：" + req.session.locale);
});

app.use('/', routes);
app.use('/user', user);
app.use('/kefu', kefu);
app.use('/config', config);

//var locale = "tw";
//i18n.setLocale(locale);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
