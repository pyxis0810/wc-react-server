var express = require('express');
var router = express.Router();
var CommentModel = require('../models/comment');

router.get('/', function(req, res, next) {
    CommentModel.find({}, function(err, comments) {
        if (err) { return next(err); }

        res.json(comments);
    });
});

router.post('/', function(req, res, next) {
    var Comment = new CommentModel({
        username: req.body.username,
        content: req.body.content
    });

    Comment.save(function(err, comment) {
        if (err) { return next(err); }

        res.json(comment);
    });
});

module.exports = router;
