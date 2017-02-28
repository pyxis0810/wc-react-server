var express = require('express');
var router = express.Router();
var PostModel = require('../models/post');

//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' );
var fs = require('fs');

//multer 셋팅
var multer  = require('multer');
var storage = multer.diskStorage({
    destination : function (req, file, callback) {
        callback(null, uploadDir );
    },
    filename : function (req, file, callback) {
        callback(null, 'posts-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
var upload = multer({ storage: storage });

router.get('/', function(req, res){
    PostModel.find({}, function(err, posts) {
        res.json(posts);
    });
});

router.post( '/', upload.single('thumbnail'), function(req, res, next) {
    var Post = new PostModel({
        title : req.body.title,
        content : req.body.content,
        thumbnail : (req.file) ? req.file.filename : ""
    });

    var validationError = Post.validateSync();
    if(!validationError){
        Post.save(function(err, post) {
            if (err) { return next(err); }

            res.send(post);
        });
    }
});

module.exports = router;
