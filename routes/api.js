/*jshint node:true */
"use strict";

var db = require('../models/db');
var express = require('express');
var router = express.Router();

router.all('/', function (req, res) {
  // TODO: Hook up API.
  res.json({"hello": "world"});
});


module.exports = router;
