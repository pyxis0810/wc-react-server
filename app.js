var express = require('express');
var helmet = require('helmet');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Passport 로그인 관련
var passport = require('passport');

// Mongo DB Setup
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var autoIncrement = require('mongoose-auto-increment');

var db = mongoose.connection;
db.on( 'error' , console.error );
db.once( 'open' , function(){
    console.log("MongoDB connect");
});

var connect = mongoose.connect('mongodb://127.0.0.1:auth/auth');
autoIncrement.initialize(connect);

var apis = require('./apis/index');
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

// passport 적용
app.use(passport.initialize());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use('/uploads', express.static('uploads'));
app.use('/apis', apis);
app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'build', 'index.html'))
});

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
    console.log(err);
    // res.render('error');
});

module.exports = app;
