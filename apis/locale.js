var express = require('express');
var router = express.Router();

var locale = require("locale");
var supported = ['en', 'ko'];

router.use(locale(supported));

router.get('/', function(req, res) {
    res.json({ language: req.locale });
});

module.exports = router;
