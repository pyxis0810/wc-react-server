var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');

var jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({
        sub: user._id,
        iat: timestamp
    }, config.JWT_SECRET);
}

var passport = require('passport');
var passportService = require('../services/passport');

var requireAuth = passport.authenticate('jwt', { session: false });
var requireSignin = passport.authenticate('local', { session: false });

router.get('/', requireAuth, function(req, res, next) {
    res.send('requireAuth test');
});

router.post('/signup', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: 'error.input.required' });
    }
    UserModel.findOne({ email: email }, function(err, user) {
        if (err) { return next(err); }

        if (user) {
            return res.status(422).send({ error: 'error.email.inuse' });
        }

        var User = new UserModel({
            email : email,
            password : password
        });

        User.save(function(err) {
            if (err) { return next(err); }

            res.json({
                token: tokenForUser(User),
                email: User.email,
                role: User.role
            });
        });
    });
});

router.post('/signin', requireSignin, function(req, res, next) {
    var user = req.user;

    res.json({
        token: tokenForUser(user),
        email: user.email,
        role: user.role
    });
});

router.get('/google',
    passport.authenticate('google', { scope: ['email'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/signin',
        session: false
    }),
    function(req, res) {
        var token = tokenForUser(req.user);
        res.redirect('/oauth?token=' + token);
    }
);

router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/signin',
        session: false
    }),
    function(req, res) {
        var token = tokenForUser(req.user);
        res.redirect('/oauth?token=' + token);
    }
);

router.get('/token', function(req, res, next) {
    var user = req.user;

    res.json({
        token: tokenForUser(user),
        email: user.email,
        role: user.role,
    });
});

router.get('/info', requireAuth, function(req, res, next) {
    var token = req.headers.authorization;
    var id = jwt.decode(token, config.JWT_SECRET);

    UserModel.findById(id.sub, function(err, user) {
        if (err) { next(err); }

        res.json({
            email: user.email,
            role: user.role
        });
    });
});

module.exports = router;
