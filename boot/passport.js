var crypto = require('crypto');
var config = require('../config');
var flash = require('express-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var _ = require('underscore');
var User = require('../models/User').User;
var TempUser = require('../models/TempUser').User;
var Words = require('../Words');
var WordSchema = require('../models/WordSchema');
var i18n = require('i18next');
var googleReCaptcha = require('../lib/googleReCaptcha');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

module.exports = function (app) {

// serialize users into and deserialize users out of the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

	passport.use('login', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, email, password, done) {


			// checks googleReCaptcha
			googleReCaptcha(req.body["g-recaptcha-response"], function(success) {
				if (!success) {

					return done(null, false,
						req.flash('error', i18n.t('text.invalidRecaptcha') ) );

				} else {

					// checks in mongodb if a user with username exists or not
					User.findOne({ 'email':  email },
						function(err, user) {
							// In case of any error, return using the done method
							if (err)
								return done(err);
							// Username does not exist, log error & redirect back
							if (!user){

								return done(null, false,
									req.flash('error', i18n.t('text.invalidEmailOrPassword') ) );
							}

							// User exists but wrong password, log the error
							// it uses User.schema.checkPassword method
							if (!user.checkPassword(password)){

								return done(null, false,
									req.flash('error', i18n.t('text.invalidEmailOrPassword') ) );
							}

							// User and password both match, return user from
							// done method which will be treated like success
							req.session.user = user;
							return done(null, user);
						}
					);
				}
			});

		}
	));


	passport.use('signup', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, email, password, done) {

			// checks googleReCaptcha
			googleReCaptcha(req.body["g-recaptcha-response"], function(success) {
				if (!success) {

					return done(null, false,
						req.flash('error', i18n.t('text.invalidRecaptcha') ) );

				} else if ( password !== req.body.confirmPassword ) {

					return done(null, false,
						req.flash('error', i18n.t('text.passwordsNotMatch') ) );

				} else {

					createTempUser = function() {

						var token;
						// creates a token
						crypto.randomBytes(20, function(err, buf) {
							if (err) return done(err);

							token = buf.toString('hex');
						});

						// looks for a user with provided email in MongoDB
						User.findOne({'email': email}, function(err, user) {
							// In case of any error return
							if (err) return done(err);

							// if user with this email already exists
							if (user) {

								return done(null, false,
									req.flash('error', i18n.t('text.suchUserExists') ) );

							} else {
								// if there is no user with that email, creates the tempUser
								var tempUser = new TempUser();

								// sets the tempUser's local credentials
								tempUser.email = email;
								tempUser.salt = Math.random() + '';
								tempUser.hashedPassword = tempUser.encryptPassword(password);
								tempUser.token = token;
								tempUser.validityTime = new Date().getTime() + 3600000; // 1 hour

								// saves the tempUser
								tempUser.save(function(err) {
									if (err) return done(err);

									// sends email with further registration instructions
									// This is the API key that you retrieve from www.mailgun.com/cp
									var auth = {
										auth: {
											api_key: config.get('mailgun:apiKey'),
											domain: config.get('mailgun:domain')
										}
									};

									var nodemailerMailgun = nodemailer.createTransport(mg(auth));

									nodemailerMailgun.sendMail({
										from: config.get('mailgun:from'),
										to: tempUser.email, // An array if you have multiple recipients.
										subject: i18n.t('text.confirmEmail'),
										html: '<div>' + i18n.t('text.confirmRegistration') + '<br /><br />' +
										'<a href=\"http://' + req.headers.host + '/signupconf/' + token +
										'\">' + "http://" + req.headers.host + "/signupconf/" + token + '</a>'

									}, function (err) {
										if (err) return done(err);

										return done(null, tempUser,
											req.flash('info', i18n.t('text.emailSentTo') + tempUser.email +
												i18n.t('text.emailSentTo2') ) );

									});
								});
							}
						});
					};

					// Delay the execution of findOrCreateUser and execute
					// the method in the next tick of the event loop
					process.nextTick(createTempUser);
				}
			});
		}
	));


    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());


};