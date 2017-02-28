var passport = require('passport');
var UserModel = require('../models/user');
var config = require('../config');

var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var localOptions = {
    usernameField: 'email',
    passwordField : 'password'
};

var localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    UserModel.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }

        if (!user) { return done(null, false); }

        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }

            if (!isMatch) { return done(null, false); }

            return done(null, user);
        })
    });
});

var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET
};

var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    UserModel.findById(payload.sub, function(err, user) {
        if (err) { return done(err, false); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

var googleOptions = {
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
};

var googleLogin = new GoogleStrategy(googleOptions,
    function(accessToken, refreshToken, profile, done) {
        UserModel.findOne({ email: profile.emails[0].value }, function(err, user) {
            if (err) { return done(err, false); }
            if (user) { return done(err, user); }

            var user = new UserModel({
                email: profile.emails[0].value,
                provider: 'google'
            });
            user.save(function(err) {
                if (err) { return done(err); }

                return done(null, user);
            });
        });
});

var facebookOptions = {
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: config.facebook.profileFields
};

var facebookLogin = new FacebookStrategy(facebookOptions,
    function(accessToken, refreshToken, profile, done) {
        UserModel.findOne({ email: profile.emails[0].value }, function(err, user) {
            if (err) { return done(err, false); }
            if (user) { return done(err, user); }

            var user = new UserModel({
                email: profile.emails[0].value,
                provider: 'facebook'
            });
            user.save(function(err) {
                if (err) { return done(err); }

                return done(null, user);
            });
        });
});

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(googleLogin);
passport.use(facebookLogin);
