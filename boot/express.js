var express = require('express');
var config = require('../config');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var path = require('path');

//var favicon = require('serve-favicon');

module.exports = function (app) {

    // view engine setup
    app.engine('ejs', require('ejs-locals'));
    app.set('views', path.join(__dirname + '/..', 'views'));
    app.set('view engine', 'ejs');

    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/css/img/favicon.ico'));

    app.use(cookieParser());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(methodOverride());

    var sessionStore = require('../lib/sessionStore');
    app.use( session({
        secret: config.get('session:secret'),
        key: config.get('session:key'),
        cookie: config.get('session:cookie'),
        rolling: config.get('session:rolling'),
        resave: config.get('session:resave'),
        saveUninitialized: config.get('session:saveUninitialized'),
        store: sessionStore
    }));

    app.use(express.static(path.join(__dirname + '/..', 'public')));
    
};